<template>
  <div>
    <v-container>
        <v-row align="center">
          <v-col>
            <v-subheader>
              [자산 관리]
            </v-subheader>
          </v-col>
        </v-row>
        <v-row>
          <v-col>자산번호</v-col>
          <v-col>현금비중</v-col>
          <v-col>현금비중액</v-col>
          <v-col>총평가금액</v-col>
          <v-col>잔고금액</v-col>
          <v-col>총예수금</v-col>
          <v-col>가정산금</v-col>
          <v-col>전일비증감</v-col>
          <v-col>순자산금</v-col>
          <v-col>매도예정</v-col>
          <v-col>매수예정</v-col>
        </v-row>
        <v-row v-for="item in contents" v-bind:key="item.asset_num">
          <v-col>{{item.asset_num}}</v-col>
          <v-col>{{item.cash_rate}}</v-col>
          <v-col>{{item.cash_rate_amt}}</v-col>
          <v-col>{{item.tot_evlu_amt}}</v-col>
          <v-col>{{item.scts_evlu_amt}}</v-col>
          <v-col>{{item.dnca_tot_amt}}</v-col>
          <v-col>{{item.prvs_rcdl_excc_amt}}</v-col>
          <v-col>{{item.asset_icdc_amt}}</v-col>
          <v-col>{{item.nass_amt}}</v-col>
          <v-col>{{item.sell_plan_amt}}</v-col>
          <v-col>{{item.buy_plan_amt}}</v-col>
        </v-row>
    </v-container>  
  </div>
</template>
<script>
import axios from "axios";

let url = "http://phills2.gonetis.com:8000/stockFundMng/list/"; //장고 서버 주소

export default {
  data() {
    return {
      contents: null
    }
  },
  methods: {
    formatDate(str){
      return str.split('T')[0];
    },
    fetchData(){
      axios({
      method: "GET",
      url: url,
      params: {
        acct_no: this.$route.params.acct_no,
        app_key: this.$route.params.app_key,
        app_secret: this.$route.params.app_secret,
        access_token: this.$route.params.access_token
      }
    })
    .then(response => {
      console.log('fundMng:', response.data)
      this.contents = response.data;
    })
    .catch(error => {
      console.log(error)
    })
    }
  },
  created() { 
    this.fetchData();
  }

   
};
</script>