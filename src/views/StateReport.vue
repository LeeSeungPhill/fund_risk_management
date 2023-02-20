<template>
  <div>
    <stockBalance msg="stateReport"/>
  </div>
  <div>
    <v-container>
      <v-row align="center">
        <v-col>
          <v-btn @click="sendForm('u')" style="background: red">[상승 추세]</v-btn>
          <v-btn @click="sendForm('d')" style="background: blue">[하락 추세]</v-btn>
          <v-btn @click="sendForm('a')" style="background: gray">[패턴 움직임]</v-btn>
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

  }

};
</script>