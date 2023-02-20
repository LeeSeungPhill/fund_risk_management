<template>
    <div>
      <v-container>
        <v-row align="center">
          <v-col>
            <v-subheader>
              [시장 레벨 관리]
            </v-subheader>
          </v-col>
        </v-row>
        <v-row>
          <v-col>리스크번호</v-col>
          <v-col>시장레벨</v-col>
          <v-col>총자산</v-col>
          <v-col>리스크(%)</v-col>
          <v-col>리스크 금액</v-col>
          <v-col>종목수</v-col>
          <v-col>종목당 리스크</v-col>
          <v-col>적용시작일</v-col>
          <v-col>적용종료일</v-col>
        </v-row>
        <v-row v-for="item in marketLevelMng" v-bind:key="item.asset_risk_num">
          <v-col>{{item.asset_risk_num}}</v-col>
          <v-col>{{item.market_level_num}}</v-col>
          <v-col>{{item.total_asset}}</v-col>
          <v-col>{{item.risk_rate}}</v-col>
          <v-col>{{item.risk_sum}}</v-col>
          <v-col>{{item.item_number}}</v-col>
          <v-col>{{item.item_risk_sum}}</v-col>
          <v-col>{{formatDate(item.aply_start_dt)}}</v-col>
          <v-col>{{formatDate(item.aply_end_dt)}}</v-col>
        </v-row>
      </v-container>    
    </div>
</template>
<script>
import axios from "axios";

let url = "http://phills2.gonetis.com:8000/stockMarketMng/list/"; //장고 서버 주소

  export default {
    data: () => {
      return {
        marketLevelMng: [],
        acct_no: null,
        app_key: null,
        app_secret: null,
        access_token: null,
      };
    },
    methods: {
      formatDate(str){
        return str.split('T')[0];
      },
      getLevel(){
        axios({
          method: "GET",
          url: url,
          params: {
            acct_no: this.$route.params.acct_no,
            app_key: this.$route.params.app_key,
            app_secret: this.$route.params.app_secret,
            access_token: this.$route.params.access_token
          }
        }).then(response => {
          this.marketLevelMng = response.data;
          console.log("Success", response)
        }).catch(error => {
          alert("처리 에러")
          console.log("Failed to get StockMarketLevelMng", error.response);
        });
      }
    },
    created(){
      this.getLevel();
    }
  };
  
</script>