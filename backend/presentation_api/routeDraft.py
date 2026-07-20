# presentation_api 창구 역할: 요청을 받아 적절한 repository에 위임하고 응답만 반환한다.
# - Map/Analyze/Persona에서 누적한 루트 초안(RouteStop[]) 조회/저장 -> data_repositories/routedraftinfo.py 호출
# - 저장 시 사라진 스팟의 완료기록 정리 -> data_repositories/routeprogressinfo.py 호출
from fastapi import APIRouter
from pydantic import BaseModel

from data_repositories import routedraftinfo, routeprogressinfo

router = APIRouter(prefix="/route-draft", tags=["route-draft"])


class RouteStopRequest(BaseModel):
    id: str
    name: str
    category: str
    address: str
    lat: float
    lng: float
    crowdLevel: str | None = None
    description: str | None = None
    tags: list[str] | None = None
    stayMinutes: int | None = None
    startTime: str | None = None
    date: str | None = None
    isAnchor: bool | None = None
    fromPersona: bool | None = None


class RouteDraftRequest(BaseModel):
    stops: list[RouteStopRequest]
    plan: dict | None = None


@router.get("/{username}")
def get_route_draft(username: str):
    return {
        "stops": routedraftinfo.get_route_draft(username),
        "plan": routedraftinfo.get_route_draft_meta(username),
    }


@router.put("/{username}")
def save_route_draft(username: str, body: RouteDraftRequest):
    """편집 멈춘 뒤 디바운스로 호출 — 초안 전체를 통째로 덮어쓴다(delete 후 재삽입)."""
    stops = routedraftinfo.save_route_draft(username, [s.model_dump() for s in body.stops])
    routedraftinfo.save_route_draft_meta(username, body.plan)
    routeprogressinfo.prune_route_progress(username, [s["id"] for s in stops])
    return {"stops": stops, "plan": body.plan}
