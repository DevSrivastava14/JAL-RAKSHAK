import logging
import asyncio
from typing import Any, Dict, List, Optional
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.config import settings

logger = logging.getLogger("jalrakshak.database")


class InMemoryCollection:
    """
    High-fidelity Async in-memory MongoDB collection mock for environments
    where a standalone MongoDB daemon is not running.
    """
    def __init__(self, name: str):
        self.name = name
        self._documents: List[Dict[str, Any]] = []

    def _matches_filter(self, doc: Dict[str, Any], filter_dict: Dict[str, Any]) -> bool:
        if not filter_dict:
            return True
        for key, value in filter_dict.items():
            if key == "$or" and isinstance(value, list):
                if not any(self._matches_filter(doc, sub_filter) for sub_filter in value):
                    return False
                continue
            
            # Check nested keys or direct keys
            doc_val = doc.get(key)
            if isinstance(value, dict):
                # Handle basic operators: $in, $gte, $lte, $gt, $lt, $ne
                if "$in" in value:
                    if doc_val not in value["$in"]:
                        return False
                if "$ne" in value:
                    if doc_val == value["$ne"]:
                        return False
                if "$gte" in value:
                    if doc_val is None or doc_val < value["$gte"]:
                        return False
                if "$lte" in value:
                    if doc_val is None or doc_val > value["$lte"]:
                        return False
                if "$gt" in value:
                    if doc_val is None or doc_val <= value["$gt"]:
                        return False
                if "$lt" in value:
                    if doc_val is None or doc_val >= value["$lt"]:
                        return False
            elif doc_val != value:
                return False
        return True

    class _AsyncCursor:
        def __init__(self, items: List[Dict[str, Any]]):
            self._items = [dict(item) for item in items]
            self._index = 0

        def __aiter__(self):
            return self

        async def __anext__(self):
            if self._index < len(self._items):
                item = self._items[self._index]
                self._index += 1
                return item
            raise StopAsyncIteration

        def sort(self, key_or_list: Any, direction: int = 1):
            if isinstance(key_or_list, str):
                self._items.sort(key=lambda x: x.get(key_or_list, 0), reverse=(direction == -1))
            elif isinstance(key_or_list, list):
                for k, d in reversed(key_or_list):
                    self._items.sort(key=lambda x: x.get(k, 0), reverse=(d == -1))
            return self

        def limit(self, count: int):
            self._items = self._items[:count]
            return self

        def skip(self, count: int):
            self._items = self._items[count:]
            return self

        async def to_list(self, length: Optional[int] = None) -> List[Dict[str, Any]]:
            if length is None:
                return [dict(i) for i in self._items]
            return [dict(i) for i in self._items[:length]]

    def find(self, filter_dict: Optional[Dict[str, Any]] = None, projection: Optional[Dict[str, Any]] = None):
        filter_dict = filter_dict or {}
        matched = [doc for doc in self._documents if self._matches_filter(doc, filter_dict)]
        if projection:
            cleaned = []
            for m in matched:
                doc_copy = {}
                for k, v in m.items():
                    if projection.get(k, 1) != 0:
                        doc_copy[k] = v
                cleaned.append(doc_copy)
            return self._AsyncCursor(cleaned)
        return self._AsyncCursor(matched)

    async def find_one(self, filter_dict: Optional[Dict[str, Any]] = None, projection: Optional[Dict[str, Any]] = None) -> Optional[Dict[str, Any]]:
        filter_dict = filter_dict or {}
        for doc in self._documents:
            if self._matches_filter(doc, filter_dict):
                result = dict(doc)
                if projection and projection.get("_id") == 0:
                    result.pop("_id", None)
                return result
        return None

    async def insert_one(self, document: Dict[str, Any]):
        doc_copy = dict(document)
        if "_id" not in doc_copy:
            doc_copy["_id"] = f"{self.name}_{len(self._documents) + 1}"
        self._documents.append(doc_copy)
        
        class InsertResult:
            def __init__(self, inserted_id):
                self.inserted_id = inserted_id
        return InsertResult(doc_copy["_id"])

    async def insert_many(self, documents: List[Dict[str, Any]]):
        ids = []
        for i, doc in enumerate(documents):
            res = await self.insert_one(doc)
            ids.append(res.inserted_id)
        class InsertManyResult:
            def __init__(self, inserted_ids):
                self.inserted_ids = inserted_ids
        return InsertManyResult(ids)

    async def update_one(self, filter_dict: Dict[str, Any], update_dict: Dict[str, Any], upsert: bool = False):
        doc = await self.find_one(filter_dict)
        if doc:
            for idx, existing in enumerate(self._documents):
                if self._matches_filter(existing, filter_dict):
                    if "$set" in update_dict:
                        self._documents[idx].update(update_dict["$set"])
                    break
        elif upsert:
            new_doc = dict(filter_dict)
            if "$set" in update_dict:
                new_doc.update(update_dict["$set"])
            await self.insert_one(new_doc)

    async def count_documents(self, filter_dict: Optional[Dict[str, Any]] = None) -> int:
        filter_dict = filter_dict or {}
        return sum(1 for doc in self._documents if self._matches_filter(doc, filter_dict))

    async def delete_many(self, filter_dict: Optional[Dict[str, Any]] = None):
        filter_dict = filter_dict or {}
        self._documents = [doc for doc in self._documents if not self._matches_filter(doc, filter_dict)]

    async def create_index(self, keys: Any, **kwargs):
        return "index_created"


class InMemoryDatabase:
    """Async database container wrapping InMemoryCollections."""
    def __init__(self, name: str):
        self.name = name
        self._collections: Dict[str, InMemoryCollection] = {}

    def __getitem__(self, item: str) -> InMemoryCollection:
        if item not in self._collections:
            self._collections[item] = InMemoryCollection(item)
        return self._collections[item]

    def get_collection(self, name: str) -> InMemoryCollection:
        return self[name]


class DatabaseManager:
    """Centralized Database Connection Manager."""
    client: Optional[AsyncIOMotorClient] = None
    db: Optional[Any] = None
    is_fallback: bool = False

    @classmethod
    async def connect(cls):
        logger.info(f"Connecting to MongoDB at {settings.MONGODB_URI}...")
        try:
            client = AsyncIOMotorClient(
                settings.MONGODB_URI,
                serverSelectionTimeoutMS=2000,
                connectTimeoutMS=2000
            )
            # Test connection with a quick ping
            await client.admin.command('ping')
            cls.client = client
            cls.db = client[settings.DATABASE_NAME]
            cls.is_fallback = False
            logger.info("Successfully connected to live MongoDB server!")
            await cls._setup_indexes()
        except Exception as ex:
            logger.warning(f"MongoDB server connection failed ({ex}). Activating in-memory storage fallback mode.")
            cls.client = None
            cls.db = InMemoryDatabase(settings.DATABASE_NAME)
            cls.is_fallback = True
            logger.info("In-memory fallback database ready for development/testing.")

    @classmethod
    async def _setup_indexes(cls):
        if cls.db is not None and not cls.is_fallback:
            try:
                await cls.db["cities"].create_index("id", unique=True)
                await cls.db["zones"].create_index([("city_id", 1), ("id", 1)])
                await cls.db["predictions"].create_index([("city_id", 1), ("zone_id", 1)])
                await cls.db["alerts"].create_index([("city_id", 1), ("severity", 1)])
                await cls.db["infrastructure"].create_index("id", unique=True)
                await cls.db["drainage_nodes"].create_index("id", unique=True)
                await cls.db["roads"].create_index("id", unique=True)
                logger.info("MongoDB indexes verified.")
            except Exception as e:
                logger.warning(f"Index creation warning: {e}")

    @classmethod
    async def disconnect(cls):
        if cls.client:
            cls.client.close()
            logger.info("MongoDB connection closed.")

    @classmethod
    def get_db(cls):
        if cls.db is None:
            cls.db = InMemoryDatabase(settings.DATABASE_NAME)
            cls.is_fallback = True
        return cls.db


def get_database():
    return DatabaseManager.get_db()
