<template>
  <div>
    <stockBalance msg="stateReport"/>
  </div>
  <div>
    <v-container>
      <v-row align="center">
        <v-col>
          <v-btn @click="sendForm('u')" style="background: red">[상승]</v-btn>
          <v-btn @click="sendForm('d')" style="background: blue">[하락]</v-btn>
          <v-btn @click="sendForm('a')" style="background: gray">[패턴]</v-btn>
        </v-col>
        <v-col>
          <v-btn @click="info('1001')" style="background: dodgerblue">[코스피]</v-btn>
          <v-btn @click="minutesInfo('0001')" style="background: lightblue">[분봉]</v-btn>
        </v-col>          
        <v-col>
          <v-btn @click="info('2001')" style="background: darksalmon">[코스닥]</v-btn>
          <v-btn @click="minutesInfo('1001')" style="background: lightpink">[분봉]</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import stockBalance from '@/components/StockBalance.vue';
import axios from "axios";

let url = "http://phills2.gonetis.com:8000/stockFundMng/list/"; //장고 서버 주소

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
    info: function(market){
      axios({
        method: "GET",
        url: "http://phills2.gonetis.com:8000/stockBalance/marketInfo/",
        params:{
          market: market
        }
            
      }).then(response => {
        console.log("Success", response)
        this.charturl = "http://phills2.gonetis.com:8000/stockBalance/"+response.data[0].market+"/"
        window.open(this.charturl, "", "_blank"); 
        this.charturl = null
      }).catch(error => {
        alert("처리 에러")
        console.log("Failed to kospiInfo", error.response);
      }); 
      if(this.charturl != null) 
        window.open(this.charturl, "", "_blank"); 
    },
    minutesInfo: function(market){
        axios({
          method: "GET",
          url: "http://phills2.gonetis.com:8000/stockBalance/marketMinutesInfo/",
          params:{
            market: market,
            app_key: this.$route.params.app_key,
            app_secret: this.$route.params.app_secret,
            access_token: this.$route.params.access_token
          }
                    
        }).then(response => {
          console.log("Success", response)
          this.charturl = "http://phills2.gonetis.com:8000/stockBalance/minutes_"+response.data[0].market+"/"
          window.open(this.charturl, "", "_blank"); 
          this.charturl = null
        }).catch(error => {
          alert("처리 에러")
          console.log("Failed to kospiMinutesInfo", error.response);
        }); 
        if(this.charturl != null) 
          window.open(this.charturl, "", "_blank"); 
      },
  }

};
</script>