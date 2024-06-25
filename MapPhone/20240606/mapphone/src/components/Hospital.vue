<template>
    <div class="container">
        <div class="total">
            <header class="navigation">
                <div class="first">
                    <div class="logo">
                        <img src="https://img.icons8.com/?size=100&id=pSoAxHFPLpWF&format=png&color=000000" alt="logo">
                    </div>
                    <div class="gps">
                        <div>위치</div>
                        <div>
                            <img src="https://img.icons8.com/?size=100&id=3723&format=png&color=000000" alt="gps">
                        </div>
                    </div>
                </div>
                <div class="second">
                    <div>
                        <img src="https://img.icons8.com/?size=100&id=63207&format=png&color=000000" alt="corectgps">
                    </div>
                    <div class="search">
                        <input type="text" placeholder="위치를 입력하세요" v-model="keyword">
                        <button class="button" @click="search">검색</button>
                    </div>
                </div>
            </header>

            <div class="totalbody">
                <!-- 장소 정보를 표시할 div -->
                <div ref="map" class="map">
                    <!-- 마커 정보 리스트 -->
                    <div class="placeinfo" v-if="selectedPlace">
                        <div class="title">
                            <strong>{{ selectedPlace.place_name }}</strong>
                        </div>                    
                        <p>{{ selectedPlace.address_name }}</p>
                        
                        <div class="number">
                            <p>{{ selectedPlace.phone }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <footer>
                <nav class="bottom">
                    <div class="bookmark" @click="togglePopup">
                        <a href="#">즐겨찾기</a>
                    </div>
                    <div class="home">
                        <RouterLink to="/main">홈</RouterLink>
                    </div>
                    <div class="logout">
                        <RouterLink to="/">로그아웃</RouterLink>
                    </div>
                </nav>
            </footer>

            <!-- 팝업창 -->
            <div v-if="showPopup" class="popup">
                <div class="popup-content">
                    <span class="close" @click="togglePopup">&times;</span>
                    <p>즐겨찾기 팝업창 내용</p>
                    <div>
                        <strong>{{ selectedPlace.place_name }}</strong>
                        </div>                    
                        <p>{{ selectedPlace.address_name }}</p>
                        <div class="number">
                            <p>{{ selectedPlace.phone }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'; // Vue에서 ref와 onMounted 함수를 가져옵니다.
import "../css/style.css";

// 검색어를 저장할 변수
const keyword = ref('');
// 장소 목록을 저장할 변수
const places = ref([]);
// 지도 인스턴스를 저장할 변수
let mapInstance;
// 장소 검색 서비스를 저장할 변수
const ps = ref(null);
// 지도 경계 변경 이벤트 리스너를 저장할 변수
const boundsChangedListener = ref(null);

// 선택된 장소 정보를 저장할 변수
const selectedPlace = ref(null);

// 팝업창 상태를 저장할 변수
const showPopup = ref(false);

// 팝업창 열기/닫기 함수
const togglePopup = () => {
    showPopup.value = !showPopup.value;
};

// 컴포넌트가 마운트되었을 때 실행될 함수
onMounted(() => {
    loadKakaoMapScript();
});

// 카카오 맵 스크립트를 로드하는 함수
const loadKakaoMapScript = () => {
    const script = document.createElement('script'); // 새로운 스크립트 태그 생성
    script.src = 'https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=0d81efa0ecfe59e238c0907b1af9c6d7&libraries=services'; // 카카오 맵 스크립트 URL 설정
    script.onload = () => { // 스크립트가 로드되면 실행될 함수
        kakao.maps.load(() => { // 카카오 맵이 로드되면 실행될 함수
            initializeKakaoMap();
        });
    };
    document.head.appendChild(script); // 스크립트를 문서의 head에 추가
};

// 카카오 맵을 초기화하는 함수
const initializeKakaoMap = () => {
    const options = {
        center: new kakao.maps.LatLng(37.498851, 127.026181), // 초기 지도 중심 좌표
        level: 5 // 초기 지도 확대 레벨
    };
    const mapContainer = document.querySelector('.map'); // 지도를 표시할 div 요소 선택
    if (!mapContainer) return; // 만약 mapContainer가 없다면 함수 종료

    mapInstance = new kakao.maps.Map(mapContainer, options); // 새로운 지도 인스턴스 생성
    ps.value = new kakao.maps.services.Places(mapInstance); // 장소 검색 서비스 생성

    // 장소 검색 및 마커 표시
    searchPlaces();

    // 지도 경계 변경 이벤트 리스너 등록
    boundsChangedListener.value = kakao.maps.event.addListener(mapInstance, 'bounds_changed', handleMapDragEnd);
};

// 장소를 검색하는 함수
const searchPlaces = () => {
    if (!ps.value) return; // 장소 검색 서비스가 초기화되지 않았으면 함수 종료
    ps.value.categorySearch('FD6', placesSearchCB, { useMapBounds: true }); // 카테고리 코드 'FD6'을 사용해 장소 검색
};

// 장소 검색 콜백 함수
const placesSearchCB = (data, status) => {
    if (status === kakao.maps.services.Status.OK) { // 검색이 성공했을 때
        places.value = data; // 검색 결과를 places 변수에 저장
        displayPlaces(data); // 검색 결과를 지도에 표시
    } else {
        // 에러 처리
    }
};

// 장소를 지도에 표시하는 함수
const displayPlaces = (places) => {
    removeAllMarkers(); // 기존 마커 제거
    places.forEach(place => {
        displayMarker(place); // 각 장소에 마커 표시
    });
};

// 장소에 마커를 표시하는 함수
const displayMarker = (place) => {
    const marker = new kakao.maps.Marker({
        map: mapInstance, // 마커를 표시할 지도 인스턴스
        position: new kakao.maps.LatLng(place.y, place.x) // 마커의 위치 좌표
    });

    // 마커 클릭 시 장소 정보 표시
    kakao.maps.event.addListener(marker, 'click', () => {
        selectedPlace.value = place; // 선택된 장소 정보를 업데이트
    });

    marker.setMap(mapInstance); // 마커를 지도에 표시
};

// 지도 드래그 종료 시 실행될 함수
const handleMapDragEnd = () => {
    const bounds = mapInstance.getBounds(); // 현재 지도 경계를 가져옴
    const swLatLng = bounds.getSouthWest(); // 남서쪽 좌표
    const neLatLng = bounds.getNorthEast(); // 북동쪽 좌표

    ps.value.categorySearch('FD6', (data, status) => {
        if (status === kakao.maps.services.Status.OK) { // 검색이 성공했을 때
            displayPlaces(data); // 검색 결과를 지도에 표시
        } else {
            // 에러 처리
        }
    }, {
        bounds: new kakao.maps.LatLngBounds(swLatLng, neLatLng) // 현재 지도 경계를 기준으로 검색
    });
};

// 모든 마커를 제거하는 함수
const removeAllMarkers = () => {
    markers.forEach(marker => {
        marker.setMap(null); // 마커를 지도에서 제거
    });
    markers = []; // 마커 배열 초기화
};

// 마커 배열
let markers = [];
</script>

<style scoped>
/* 팝업 스타일 */
.popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 50%;
    height: 50%;
    background: rgba(255, 225, 225, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.popup-content {
    background: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    position: relative;
}

.popup-content .close {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 15px;
    cursor: pointer;
}
</style>
