from unittest.mock import patch

from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


@patch("presentation_api.findAmenities.tourAPI.find_nearby_wellness")
def test_find_amenities_calls_service_with_query_params(mock_find):
    mock_find.return_value = [{"contentId": "1", "title": "테스트 시설"}]

    response = client.get("/amenities", params={"lat": 37.5, "lng": 127.0, "radius": 2000})

    assert response.status_code == 200
    assert response.json() == [{"contentId": "1", "title": "테스트 시설"}]
    mock_find.assert_called_once_with(latitude=37.5, longitude=127.0, radius=2000, theme_code=None)


@patch("presentation_api.findAmenities.tourAPI.find_nearby_wellness")
def test_find_amenities_uses_default_radius_when_not_given(mock_find):
    mock_find.return_value = []

    client.get("/amenities", params={"lat": 37.5, "lng": 127.0})

    mock_find.assert_called_once_with(latitude=37.5, longitude=127.0, radius=3000, theme_code=None)


@patch("presentation_api.findAmenities.tourAPI.find_nearby_wellness")
def test_find_amenities_forwards_theme_filter(mock_find):
    mock_find.return_value = []

    client.get("/amenities", params={"lat": 37.5, "lng": 127.0, "theme": "EX050100"})

    mock_find.assert_called_once_with(latitude=37.5, longitude=127.0, radius=3000, theme_code="EX050100")


def test_find_amenities_requires_lat_lng():
    response = client.get("/amenities")

    assert response.status_code == 422
