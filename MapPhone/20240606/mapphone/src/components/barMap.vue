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
                    <div class="serch">
                        <input type="text" placeholder="위치를 입력하세요">
                        <button class="button">검 색</button>
                    </div>
                </div>
            </header>

            <!-- 지도 부분 -->
            <div class="totalbody">
                <div id="map" class="map"></div>
            </div>

            <!-- 풋터 -->
            <footer>
                <nav class="botom">
                    <div class="Bookmark">
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

<script>
export default {
    name: 'MapComponent',
    data() {
        return {};
    },
    mounted() {
        if (window.kakao && window.kakao.maps) {
            this.initMap();
        } else {
            const script = document.createElement('script');
            /* global kakao */
            script.onload = () => kakao.maps.load(this.initMap);
            script.src =
                'http://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=9f647a199751b8c18f579fff34313544';
            document.head.appendChild(script);
        }
    },
    methods: {
        initMap() {
            var mapContainer = document.getElementById('map'); // 지도를 표시할 div
            var mapOption = {
                center: new kakao.maps.LatLng(37.564343, 126.947613), // 지도의 중심좌표
                level: 3 // 지도의 확대 레벨
            };
            var map = new kakao.maps.Map(mapContainer, mapOption);

            var positions = [
                {
                    latlng: new kakao.maps.LatLng(37.562632898194835, 126.9454282268269)
                },
                {
                    latlng: new kakao.maps.LatLng(37.56195884514403, 126.94922601468826)
                }
            ];

            positions.forEach(function (pos) {
                var marker = new kakao.maps.Marker({
                    position: pos.latlng // 마커의 위치
                });
                marker.setMap(map);
            });
        }
    }
};
</script>

<style scoped>
/* 전체 */
html,
body {
    height: 100%;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'IBM Plex Sans KR', sans-serif;
}

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

.serch {
    display: flex;
    align-items: center;
}

.serch input {
    flex-grow: 1;
    border: 1px solid #000000;
    border-radius: 10px;
    padding: 3px 50px;
    height: 20px;
    width: 100%;
}

.serch .button {
    background-color: #000000;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 10px;
    margin-left: 5px;
    cursor: pointer;
    width: 50%;

}

.serch .button:hover {
    background-color: #e68900;
}

/* 바디 부분 */
.totalbody {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
    padding: 10px;
    height: 900px;
}

.map {
    width: 100%;
    height: 400px;
}

.one,
.two,
.three {
    display: flex;
    justify-content: space-around;
    margin: 10px 0;
}

.one img,
.two img,
.three img {
    width: 150px;
    height: 150px;
    object-fit: cover;
    margin: 15px 20px 15px 20px;
    padding: 15px 10px 15px 10px;
}

/* 맵 부분 */

.map {
    width: 100%;
    height: 50%;
    object-fit: cover;
    margin-top: 0;
}

/* 풋터 부분 */
footer {
    border: 1px solid violet;
    height: 15%;
    background-color: rgb(249, 96, 211);
}

.botom {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 100%;
    padding-top: 20px;
    padding-bottom: 20px;
}
</style>
