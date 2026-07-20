# insert, select, delete
# - 완료 체크한 스팟 id 집합 조회/토글 (presentation_api/routeProgress.py에서 호출)
# - route_draft_stop과 반드시 별도 테이블: save_route_draft()가 delete 후 재삽입하는
#   방식이라, 완료 여부가 같은 테이블에 있으면 루트 초안을 저장할 때마다 완료 표시가
#   초기화되는 문제가 생긴다. 행이 존재하면 완료, 없으면 미완료(별도 bool 컬럼 불필요).
from config.dependency import get_supabase_client

TABLE = "route_progress"


def get_completed_stop_ids(username: str) -> list[str]:
    client = get_supabase_client()
    result = client.table(TABLE).select("stop_id").eq("username", username).execute()
    return [row["stop_id"] for row in result.data]


def mark_completed(username: str, stop_id: str) -> dict:
    client = get_supabase_client()
    result = (
        client.table(TABLE)
        .upsert({"username": username, "stop_id": stop_id}, on_conflict="username,stop_id")
        .execute()
    )
    return result.data[0]


def mark_incomplete(username: str, stop_id: str) -> None:
    client = get_supabase_client()
    client.table(TABLE).delete().eq("username", username).eq("stop_id", stop_id).execute()


def prune_route_progress(username: str, valid_stop_ids: list[str]) -> None:
    """route-draft 저장 시 사라진 스팟의 완료기록이 영구히 남지 않도록 정리한다.
    (route_draft_stop 저장 직후 presentation_api/routeDraft.py에서 호출)"""
    client = get_supabase_client()
    existing = client.table(TABLE).select("stop_id").eq("username", username).execute()
    valid_ids = set(valid_stop_ids)
    stale_ids = [row["stop_id"] for row in existing.data if row["stop_id"] not in valid_ids]
    if stale_ids:
        client.table(TABLE).delete().eq("username", username).in_("stop_id", stale_ids).execute()
