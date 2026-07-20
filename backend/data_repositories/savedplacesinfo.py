# insert, select, delete
# - 찜한 장소(SAVED_PLACES) 조회/저장/삭제 (presentation_api/savedPlaces.py에서 호출)
from config.dependency import get_supabase_client

TABLE = "saved_places"


def get_saved_places(username: str) -> list[dict]:
    client = get_supabase_client()
    result = (
        client.table(TABLE)
        .select("*")
        .eq("username", username)
        .order("saved_at")
        .execute()
    )
    return result.data


def upsert_saved_place(username: str, place: dict) -> dict:
    """하트를 눌러 저장. place_id(PK) 기준으로 없으면 insert, 있으면 스냅샷 갱신."""
    client = get_supabase_client()
    row = {
        "username": username,
        "place_id": place["id"],
        "name": place.get("name"),
        "category": place.get("category"),
        "address": place.get("address"),
        "lat": place.get("lat"),
        "lng": place.get("lng"),
        "image_url": place.get("imageUrl"),
        "crowd_level": place.get("crowdLevel"),
        "tags": place.get("tags"),
    }
    result = client.table(TABLE).upsert(row, on_conflict="username,place_id").execute()
    return result.data[0]


def delete_saved_place(username: str, place_id: str) -> None:
    """하트를 다시 눌러 해제."""
    client = get_supabase_client()
    client.table(TABLE).delete().eq("username", username).eq("place_id", place_id).execute()
