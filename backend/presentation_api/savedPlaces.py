# presentation_api 창구 역할: 요청을 받아 적절한 repository에 위임하고 응답만 반환한다.
# - 찜한 장소 조회 요청 -> data_repositories/savedplacesinfo.py 호출
# - 하트 토글(저장/해제) 요청 -> data_repositories/savedplacesinfo.py 호출
from fastapi import APIRouter
from pydantic import BaseModel

from data_repositories import savedplacesinfo

router = APIRouter(prefix="/saved-places", tags=["saved-places"])


class SavedPlaceRequest(BaseModel):
    id: str
    name: str
    category: str
    address: str
    lat: float
    lng: float
    imageUrl: str | None = None
    crowdLevel: str | None = None
    tags: list[str] | None = None


@router.get("/{username}")
def get_saved_places(username: str):
    return savedplacesinfo.get_saved_places(username)


@router.put("/{username}")
def save_place(username: str, body: SavedPlaceRequest):
    return savedplacesinfo.upsert_saved_place(username, body.model_dump())


@router.delete("/{username}/{place_id}")
def unsave_place(username: str, place_id: str):
    savedplacesinfo.delete_saved_place(username, place_id)
    return {"ok": True}
