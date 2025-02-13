<template>
  <div>
    <stockBalance msg="stateReport"/>
  </div>
  <div>
    <v-container fluid>
      <v-row no-gutter>
        <!-- <v-col>
          <v-btn @click="sendForm('u')" style="background: red">[상승]</v-btn>
          <v-btn @click="sendForm('d')" style="background: blue">[하락]</v-btn>
          <v-btn @click="sendForm('a')" style="background: gray">[패턴]</v-btn>
        </v-col> -->
        <v-col>
          <v-btn @click="info('0001', 'W')" style="background: dodgerblue">[코스피-주]</v-btn>
          <v-btn @click="info('0001', 'D')" style="background: dodgerblue">[코스피-일]</v-btn>
          <v-btn @click="minutesInfo('0001', '3600')" style="background: lightblue">[코스피-60분]</v-btn>
          <v-btn @click="minutesInfo('0001', '600')" style="background: lightblue">[코스피-10분]</v-btn>
        </v-col>          
        <v-col>
          <v-btn @click="info('1001', 'W')" style="background: darksalmon">[코스닥-주]</v-btn>
          <v-btn @click="info('1001', 'D')" style="background: darksalmon">[코스닥-일]</v-btn>
          <v-btn @click="minutesInfo('1001', '3600')" style="background: lightpink">[코스닥-60분]</v-btn>
          <v-btn @click="minutesInfo('1001', '600')" style="background: lightpink">[코스닥-10분]</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import stockBalance from '@/components/StockBalance.vue';
import axios from "axios";

const host = process.env.VUE_APP_BASE_URL
let url = host + "/stockFundMng/list/"; //장고 서버 주소

export default {
  name: 'stateReport',
  components: {
    stockBalance,
  },
  methods: {
    sendForm: function(id) { 
      axios({
        method: "GET",
        url: url,
        params: {
          market_change: id,
          acct_no: this.$route.params.acct_no,
          app_key: this.$route.params.app_key,
          app_secret: this.$route.params.app_secret,
          access_token: this.$route.params.access_token
        }
      }).then(response => {
        console.log("Success", response)
        alert("처리 완료")
      }).catch(error => {
        alert("처리 에러")
        console.log("Failed to get StockFundMng", error.response);
      });
    },
    info: function(market, weekday){
      axios({
        method: "GET",
        url: host + "/stockBalance/marketInfo/",
        params:{
          market: market,
          weekday: weekday,
          app_key: this.$route.params.app_key,
          app_secret: this.$route.params.app_secret,
          access_token: this.$route.params.access_token
        }
            
      }).then(response => {
        console.log("Success", response)
        this.charturl = host + "/stockBalance/"+response.data[0].market+"/"
        window.open(this.charturl, "PopupWin", "width=1000,height=1000", true); 
        this.charturl = null
      }).catch(error => {
        alert("처리 에러")
        console.log("Failed to kospiInfo", error.response);
      }); 
      if(this.charturl != null) 
        window.open(this.charturl, "PopupWin", "width=1000,height=1000", true); 
    },
    minutesInfo: function(market, minute){
        axios({
          method: "GET",
          url: host + "/stockBalance/marketMinutesInfo/",
          params:{
            market: market,
            minute: minute,
            app_key: this.$route.params.app_key,
            app_secret: this.$route.params.app_secret,
            access_token: this.$route.params.access_token
          }
                    
        }).then(response => {
          console.log("Success", response)
          this.charturl = host + "/stockBalance/minutes_"+response.data[0].market+"/"
          window.open(this.charturl, "PopupWin", "width=1000,height=1000", true); 
          this.charturl = null
        }).catch(error => {
          alert("처리 에러")
          console.log("Failed to kospiMinutesInfo", error.response);
        }); 
        if(this.charturl != null) 
          window.open(this.charturl, "PopupWin", "width=1000,height=1000", true); 
      },
  }

};
</script>