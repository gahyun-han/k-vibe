# presentation_api 창구 역할: 요청을 받아 위임하고 응답만 반환한다.
# - 현위치 기반 연관관광지 추천 요청 -> externelAPI_services/tourAPI.py 호출
from fastapi import APIRouter

from externelAPI_services import tourAPI

router = APIRouter(prefix="/attractions", tags=["attractions"])


@router.get("/related")
def find_related_attractions(lat: float, lng: float):
    return tourAPI.find_related_attractions(latitude=lat, longitude=lng)
