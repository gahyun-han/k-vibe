# presentation_api 창구 역할: 요청을 받아 적절한 repository에 위임하고 응답만 반환한다.
# - 완료 체크한 스팟 id 집합 조회/토글 -> data_repositories/routeprogressinfo.py 호출
# - route-draft와 별도 엔드포인트: 완료 체크는 클릭 즉시 1건 전송(디바운스 없음)
from fastapi import APIRouter

from data_repositories import routeprogressinfo

router = APIRouter(prefix="/route-progress", tags=["route-progress"])


@router.get("/{username}")
def get_route_progress(username: str):
    return routeprogressinfo.get_completed_stop_ids(username)


@router.put("/{username}/{stop_id}")
def mark_completed(username: str, stop_id: str):
    return routeprogressinfo.mark_completed(username, stop_id)


@router.delete("/{username}/{stop_id}")
def mark_incomplete(username: str, stop_id: str):
    routeprogressinfo.mark_incomplete(username, stop_id)
    return {"ok": True}
