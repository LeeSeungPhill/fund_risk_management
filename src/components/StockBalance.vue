<template>
  <div>
    <v-container>
        <v-row align="center">
          <v-col>
            <v-subheader>
              [현재 보유 종목]
            </v-subheader>
          </v-col>
        </v-row>
        <v-row>
          <v-col>종목명</v-col>
          <v-col>매입가</v-col>
          <v-col>현재가</v-col>
          <v-col>수익률(%)</v-col>
          <v-col>보유수량</v-col>
          <v-col>매입금액</v-col>
          <v-col>평가금액</v-col>
          <v-col>증감금액</v-col>
          <v-col>자산번호</v-col>
        </v-row>
        <v-row v-for="item in contents" v-bind:key="item.name">
          <v-col><a @click="doInfo(item.name)">{{item.name}}</a></v-col>
          <v-col>{{item.purchase_price}}</v-col>
          <v-col>{{item.current_price}}</v-col>
          <v-col>{{item.earnings_rate}}</v-col>
          <v-col>{{item.purchase_amount}}</v-col>
          <v-col>{{item.purchase_sum}}</v-col>
          <v-col>{{item.eval_sum}}</v-col>
          <v-col>{{item.valuation_sum}}</v-col>
          <v-col>{{item.asset_num}}</v-col>
        </v-row>
    </v-container>      
  </div>
</template>

<script>
import axios from "axios";

let url = "http://phills2.gonetis.com:8000/stockBalance/list/"; //장고 서버 주소

export default {
  data() {
    return {
      contents: null,
      company_name: null,
      charturl: null,
    }
  },
  name: 'HelloWorld',
  methods: {
    doInfo(name){
      axios({
          method: "GET",
          url: "http://phills2.gonetis.com:8000/stockBalance/info/",
          params:{
            company: name,
          }
          
        }).then(response => {
          console.log("Success", response)
          this.company_name = response.data[0].name
          
          if(name == this.company_name) {
            this.charturl = "http://phills2.gonetis.com:8000/stockBalance/"+this.company_name+"/"
            window.open(this.charturl, "", "_blank"); 
            this.company_name = null
            this.charturl = null
          }
        }).catch(error => {
          alert("처리 에러")
          console.log("Failed to searchStock", error.response);
        }); 
      if(this.charturl != null) 
          window.open(this.charturl, "", "_blank"); 
    },
    formatDate(str){
      return str.split('T')[0];
    },
    fetchData(){
      axios({
      method: "GET",
      url: url,
      params:{
        acct_no: this.$route.params.acct_no,
        app_key: this.$route.params.app_key,
        app_secret: this.$route.params.app_secret,
        access_token: this.$route.params.access_token
      }
    })
    .then(response => {
      console.log('stocks:', response.data)
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

  
}
</script>
