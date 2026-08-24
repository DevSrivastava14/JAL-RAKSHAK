import httpx
from fastapi import APIRouter

# Initialize the router
router = APIRouter(
    prefix="",
    tags=["Notifications"]
)

# ⚠️ Change this to your chosen topic name that you subscribed to on your phone app
NTFY_TOPIC = "jal_rakshak_demo"

@router.post("/broadcast")
async def broadcast_alert():
    """
    Broadcasts a high-priority emergency push notification to all subscribed devices.
    """
    ntfy_url = f"https://ntfy.sh/{NTFY_TOPIC}"
    
    # We use httpx (standard async HTTP client in FastAPI) to keep it fast and non-blocking
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(
                ntfy_url,
                content="🚨 CRITICAL FLOOD ALERT: High water depth detected in Kurla catchment zone. Safe corridors rerouted through Dadar.",
                headers={
                    "Title": "JAL-RAKSHAK Emergency Broadcast",
                    "Priority": "urgent",             # Triggers max-volume alert on the device
                    "Tags": "rotating_light,warning", # Adds sirens and warning emojis to the push
                },
                timeout=10.0
            )
            
            if response.status_code == 200:
                return {
                    "status": "success",
                    "message": "Emergency alert broadcasted successfully via ntfy",
                    "topic": NTFY_TOPIC
                }
            else:
                return {
                    "status": "failed",
                    "error": f"ntfy server returned status code {response.status_code}"
                }
                
        except Exception as e:
            return {
                "status": "failed",
                "error": str(e)
            }