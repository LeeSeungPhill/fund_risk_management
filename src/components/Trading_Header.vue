<template>
    <div class="header">
        <h1>Fund Risk Management</h1>
        <v-container fluid>
            <v-row align="center">
                <v-col>
                    <v-list-tile-title @click="$router.push({name:'stateReport', params: {acct_no: this.acct_no, app_key: this.app_key, app_secret: this.app_secret, access_token: this.access_token, tel_no: this.tel_no, token_publ_date: this.token_publ_date}})">
                        Balance / 
                    </v-list-tile-title>
                    <v-list-tile-title @click="$router.push({name:'stockOrder', params: {acct_no: this.acct_no, app_key: this.app_key, app_secret: this.app_secret, access_token: this.access_token, tel_no: this.tel_no, token_publ_date: this.token_publ_date}})">
                        Order / 
                    </v-list-tile-title>
                    <v-list-tile-title @click="$router.push({name:'fundMng', params: {acct_no: this.acct_no, app_key: this.app_key, app_secret: this.app_secret, access_token: this.access_token, tel_no: this.tel_no, token_publ_date: this.token_publ_date}})">
                        Fund / 
                    </v-list-tile-title>
                    <v-list-tile-title @click="$router.push({name:'marketLevelMng', params: {acct_no: this.acct_no, app_key: this.app_key, app_secret: this.app_secret, access_token: this.access_token, tel_no: this.tel_no, token_publ_date: this.token_publ_date}})">
                        Market Level : 
                    </v-list-tile-title>
                    
                    <select v-model="selected">
                    <option v-for="(d, i) in options" :key="i" :value="d.value">
                        {{ d.text }}
                    </option>
                    </select> => 
                    <v-btn @click="auth" style="background: blueviolet">인증</v-btn>
                    <v-btn @click="reauth" style="background: mediumvioletred">인증초기화</v-btn>
                </v-col>
          </v-row>
        </v-container>  
    </div>
</template>

<script>
import axios from "axios";

const host = process.env.VUE_APP_BASE_URL

export default {
    data: () => {
        return {
            acct_no: null,
            tel_no: null,
            app_key: null,
            app_secret: null,
            access_token: null,
            token_publ_date: null,
            selected: 'phills75',
            options: [
                { text: 'Jupyter', value: 'phills75' }, { text: 'Terra', value: 'phills2' }, { text: 'Tess', value: 'chichipa' }, { text: 'Mama', value: 'yh480825' }, { text: 'Mamalong', value: 'mamalong' }, { text: 'Leo', value: 'phills13' }, { text: 'Sharon', value: 'phills15' }
            ],
            
        }
    },
    methods: {
        auth: function() { 
            axios({
                method: "GET",
                url: host + "/stockAccount/",
                params:{
                    nick_name: this.selected
                }
            }).then((response) => {
                console.log("Success", response);
                this.acct_no = response.data[0].acct_no
                this.tel_no = response.data[0].tel_no
                this.app_key = response.data[0].app_key
                this.app_secret = response.data[0].app_secret
                this.access_token = response.data[0].access_token
                this.token_publ_date = response.data[0].token_publ_date

                this.$router.push({name:'stateReport', params: {acct_no: this.acct_no, app_key: this.app_key, app_secret: this.app_secret, access_token: this.access_token, tel_no: this.tel_no, token_publ_date: this.token_publ_date}}); 
            }).catch((error) => {
                alert("인증처리 에러")
                console.log("Failed to Stock Account Auth", error.response);
            });

        },
        reauth: function() {
            axios({
                method: "GET",
                url: host + "/stockAccount/init/",
                    params:{
                        nick_name: this.selected
                    }
            }).then((response) => {
                console.log("Success", response);
                this.acct_no = ""
                this.tel_no = ""
                this.app_key = ""
                this.app_secret = ""
                this.access_token = ""
                this.token_publ_date = ""

                this.$router.push({name:'stateReport', params: {acct_no: this.acct_no, app_key: this.app_key, app_secret: this.app_secret, access_token: this.access_token, tel_no: this.tel_no, token_publ_date: this.token_publ_date}});                     
            }).catch((error) => {
                alert("인증초기화 처리 에러")
                console.log("Failed to Stock Account Auth", error.response);
            });
        }
    }
};
</script>

<style scoped>
.header {
    text-align: center;
    background-color: lightgray;
}
</style>