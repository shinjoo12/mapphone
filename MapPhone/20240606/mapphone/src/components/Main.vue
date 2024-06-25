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
            <div class="totalbody">
                <div class="one">
                    <div>
                        <router-link to="main/foodmap">
                            <img src="https://img.icons8.com/?size=100&id=aeLEOHJU5cpb&format=png&color=000000"
                                alt="식당">
                        </router-link>
                    </div>
                    <div>
                        <img src="https://img.icons8.com/?size=100&id=fR0OOR9q4nZg&format=png&color=000000" alt="술집">

                    </div>
                </div>
                <div class="two">
                    <div>
                        <img src="https://img.icons8.com/?size=100&id=BXrlpBmUDxLJ&format=png&color=000000" alt="카페">
                    </div>
                    <div>
                        <img src="https://img.icons8.com/?size=100&id=18160&format=png&color=000000" alt="미용실">
                    </div>
                </div>
                <div class="three">
                    <div>
                        <router-link to="main/hospitalmap">
                            <img src="https://img.icons8.com/?size=100&id=pTc17tvX2kMn&format=png&color=000000"
                                alt="병원">
                        </router-link>
                    </div>
                    <div>
                        <img src="https://img.icons8.com/?size=100&id=3rJFC2vi1fHH&format=png&color=000000" alt="약국">
                    </div>
                </div>
            </div>
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

<style scoped>

</style>

<script>
import "../css/mainstyle.css";

</script>