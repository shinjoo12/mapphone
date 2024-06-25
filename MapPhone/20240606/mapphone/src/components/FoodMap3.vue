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
            <button class="button" @click="search">검 색</button>
          </div>
        </div>
      </header>

      <div class="totalbody">
        <!-- 지도를 표시할 div -->
        <div ref="map" class="map"></div>

        <!-- 마커 정보 리스트 -->
        <div class="placeinfo">
          <ul>
            <li v-for="(place, index) in places" :key="index">
              <!-- 이름 정보 -->
              <strong>{{ place.place_name }}</strong>
              <!-- 주소 -->
              <p>{{ place.address_name }}</p>
              <!-- 번호 -->
              <p>{{ place.phone }}</p>
            </li>
          </ul>
          <div v-if="selectedPlace" class="selected-place-info">
            <h2>{{ selectedPlace.place_name }}</h2>
            <p>{{ selectedPlace.address_name }}</p>
            <p>{{ selectedPlace.phone }}</p>
          </div>

        </div>
      </div>

      <footer>
        <nav class="bottom">
          <div class="bookmark">
            <a href="">즐겨찾기</a>
          </div>
          <div class="home">
            <RouterLink to="/main">홈</RouterLink>
          </div>
          <div class="logout">
            <RouterLink to="/">로그아웃</RouterLink>
          </div>
        </nav>
      </footer>
    </div>
  </div>
</template>

<script setup>

// Vue의 ref와 onMounted를 import합니다.
import { ref, onMounted } from 'vue';

// keyword는 사용자가 입력한 검색어를 저장하는 반응형 변수입니다.
const keyword = ref('');

// places는 검색된 장소 정보를 저장하는 반응형 배열입니다.
const places = ref([]);

// mapInstance는 Kakao 지도 인스턴스를 저장할 변수입니다.
let mapInstance;

// ps는 Kakao 지도 서비스 객체를 저장할 반응형 변수입니다.
const ps = ref(null);

// boundsChangedListener는 지도 경계 변경 이벤트 리스너를 저장할 반응형 변수입니다.
const boundsChangedListener = ref(null);


// Vue 컴포넌트가 마운트되었을 때 실행되는 함수입니다.
onMounted(() => {
  loadKakaoMapScript();
});

// Kakao 지도 스크립트를 동적으로 로드하는 함수입니다.
const loadKakaoMapScript = () => {
  const script = document.createElement('script');
  // Kakao 지도 API 스크립트를 로드합니다.
  script.src = 'https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=0d81efa0ecfe59e238c0907b1af9c6d7&libraries=services';
  script.onload = () => {
    // Kakao 지도 API 로드가 완료되면 initializeKakaoMap 함수를 호출합니다.
    kakao.maps.load(() => {
      initializeKakaoMap();
    });
  };
  // 스크립트를 문서의 head에 추가합니다.
  document.head.appendChild(script);
};

// Kakao 지도를 초기화하는 함수입니다.
const initializeKakaoMap = () => {
  const options = {
    // 지도의 초기 중심 좌표입니다.
    center: new kakao.maps.LatLng(37.498832, 127.026089),
    // 지도의 초기 확대 레벨입니다.
    level: 5
  };
  // 지도를 표시할 HTML 요소를 선택합니다.
  const mapContainer = document.querySelector('.map');
  if (!mapContainer) return;

  // Kakao 지도 인스턴스를 생성합니다.
  mapInstance = new kakao.maps.Map(mapContainer, options);
  // Kakao 지도 서비스 객체를 생성합니다.
  ps.value = new kakao.maps.services.Places(mapInstance);

  // 장소 검색 및 마커 표시를 실행합니다.
  searchPlaces();

  // 지도 경계 변경 이벤트 리스너를 등록합니다.
  boundsChangedListener.value = kakao.maps.event.addListener(mapInstance, 'bounds_changed', handleMapDragEnd);
};

// 장소를 검색하는 함수입니다.
const searchPlaces = () => {
  if (!ps.value) return;
  // 카테고리 검색을 실행합니다.
  ps.value.categorySearch('FD6', placesSearchCB, { useMapBounds: true });
  // 'FD6' 카테고리는 음식점입니다.
  // 원하는 다른 카테고리 코드를 사용하여 다른 장소를 검색할 수 있습니다.
};

// 장소 검색 콜백 함수입니다.
const placesSearchCB = (data, status) => {
  if (status === kakao.maps.services.Status.OK) {
    // 검색된 장소 데이터를 places에 저장합니다.
    places.value = data;
    // 장소 데이터를 표시합니다.
    displayPlaces(data);
  } else {
    // 에러 처리를 할 수 있습니다.
  }
};

// 장소 데이터를 화면에 표시하는 함수입니다.
const displayPlaces = (places) => {
  // 모든 마커를 제거합니다.
  removeAllMarkers();
  // 각 장소에 대해 마커를 표시합니다.
  places.forEach(place => {
    displayMarker(place);
  });
};

// 특정 장소에 마커를 표시하는 함수입니다.
const displayMarker = (place) => {
  // 새로운 마커를 생성합니다.
  const marker = new kakao.maps.Marker({
    map: mapInstance,
    position: new kakao.maps.LatLng(place.y, place.x)
  });

  // 마커 클릭 이벤트 리스너를 추가합니다.
  kakao.maps.event.addListener(marker, 'click', () => {
    displayPlaceInfo(place);
  });

  // kakao.maps.event.addListener(marker, 'mouseover', function () {
  //   displayPlaceInfo(place);
  // });

  // 마커를 지도에 표시합니다.
  marker.setMap(mapInstance);
  // 마커를 배열에 저장합니다.
  markers.push(marker);
};

// 지도 경계 변경 시 실행되는 함수입니다.
const handleMapDragEnd = () => {
  // 지도의 현재 경계를 가져옵니다.
  const bounds = mapInstance.getBounds();
  const swLatLng = bounds.getSouthWest();
  const neLatLng = bounds.getNorthEast();

  // 경계 내에서 카테고리 검색을 실행합니다.
  ps.value.categorySearch('FD6', (data, status) => {
    if (status === kakao.maps.services.Status.OK) {
      displayPlaces(data);
    } else {
      // 에러 처리를 할 수 있습니다.
    }
  }, {
    bounds: new kakao.maps.LatLngBounds(swLatLng, neLatLng)
  });
};

// 장소의 상세 정보를 표시하는 함수입니다.
const displayPlaceInfo = (place) => {
  // 장소 상세 정보를 표시하는 로직을 작성할 수 있습니다.
};

// 모든 마커를 제거하는 함수입니다.
const removeAllMarkers = () => {
  markers.forEach(marker => {
    marker.setMap(null);
  });
  markers = [];
};

// 현재 지도에 표시된 마커를 저장하는 배열입니다.
let markers = [];



</script>

<style scoped>
/* 스타일 */
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.total {
  border: 1px solid rgb(0, 0, 0);
  width: 80%;
  max-width: 500px;
  height: 100%;
  max-height: 100vh;
  background-color: white;
  box-shadow: 0 0 10px rgba(255, 84, 84, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* 헤더파트 */
.navigation {
  border: 1px solid rgb(255, 150, 150);
  background-color: #ff58e9;
  height: 10%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.first,
.second {
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
}

.logo img,
.gps img {
  width: 30px;
  height: 30px;
  object-fit: cover;
  display: flex;
}

.second img {
  width: 30px;
  height: 32px;
  object-fit: cover;
  display: flex;
}

.search {
  display: flex;
  align-items: center;
}

.search input {
  flex-grow: 1;
  border: 1px solid #000000;
  border-radius: 10px;
  padding: 3px 50px;
  height: 20px;
  width: 100%;
}

.search .button {
  background-color: #000000;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 10px;
  margin-left: 5px;
  cursor: pointer;
  width: 50%;
}

.search .button:hover {
  background-color: #e68900;
}

/* 바디 부분 */
.totalbody,
.totalbody * {
  margin: 0;
  padding: 0;
  font-family: 'Malgun Gothic', dotum, '돋움', sans-serif;
  font-size: 12px;
}

.totalbody {
  position: relative;
  width: 100%;
  height: 350px;
}

.map {
  width: 100%;
  height: 400px;
}

.placeinfo_wrap {
  position: absolute;
  bottom: 28px;
  left: -150px;
  width: 300px;
}

.placeinfo {
  position: relative;
  width: 100%;
  border-radius: 6px;
  border: 1px solid #ccc;
  border-bottom: 2px solid #ddd;
  padding-bottom: 10px;
  background: #fff;
}

.placeinfo:nth-of-type(n) {
  border: 0;
  box-shadow: 0px 1px 2px #888;
}

.placeinfo_wrap .after {
  content: '';
  position: relative;
  margin-left: -12px;
  left: 50%;
  width: 22px;
  height: 12px;
  background: url('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/vertex_white.png');
}

.placeinfo a,
.placeinfo a:hover,
.placeinfo a:active {
  color: #fff;
  text-decoration: none;
}

.placeinfo a,
.placeinfo span {
  display: block;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.placeinfo span {
  margin: 5px 5px 0 5px;
  cursor: default;
  font-size: 13px;
}

.placeinfo .title {
  font-weight: bold;
  font-size: 14px;
  border-radius: 6px 6px 0 0;
  margin: -1px -1px 0 -1px;
  padding: 10px;
  color: #fff;
  background: #d95050;
  background: #d95050 url(https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/arrow_white.png) no-repeat right 14px center;
}

.placeinfo .tel {
  color: #0f7833;
}

.placeinfo .jibun {
  color: #999;
  font-size: 11px;
  margin-top: 0;
}

/* 풋터 부분 */
footer {
  border: 1px solid violet;
  height: 15%;
  background-color: rgb(249, 96, 211);
}

.bottom {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100%;
  padding-top: 20px;
  padding-bottom: 20px;
}
</style>
