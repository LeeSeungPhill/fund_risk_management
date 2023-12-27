<template>
  <div class="close-image">
      <v-container>
        <v-row>
          <v-col>
            <v-text-field v-model="data.company" label="종목명" @keypress.enter="searchStock(data);"></v-text-field>
          </v-col>    
          <v-col>시가총액 : {{total_market_value}} 억원 <v-btn @click="closePopup()" style="background: gray">닫기</v-btn>
          </v-col>   
        </v-row>
        <v-row>
          <v-col>종목코드 : {{code}}</v-col>
          <v-col>현재가 : {{now_price}}</v-col>
          <v-col>최고가 : {{high_price}}</v-col>
          <v-col>최저가 : {{low_price}}</v-col>
        </v-row>
        <v-row>
          <v-col>
            거래량 (전일대비거래량) : {{volumn}} ({{prdy_vol_rate}})</v-col>
          <v-col>시가 : {{open_price}}</v-col>
          <v-col>상한가 : {{max_price}}</v-col>
          <v-col>하한가 : {{min_price}}</v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field v-model="data.through_price" label="돌파가격" ></v-text-field>
            <v-text-field v-model="data.leave_price" label="이탈가격" ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field v-model="data.resist_price" label="저항가격" ></v-text-field>
            <v-text-field v-model="data.support_price" label="지지가격" ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field v-model="data.trend_high_price" label="추세상단가격" ></v-text-field>
            <v-text-field v-model="data.trend_low_price" label="추세하단가격" ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field v-model="data.buy_expect_sum" label="매수예상금액" ></v-text-field>
            <v-btn @click="saveInterestItem" style="background: darkseagreen">등록</v-btn>
            <v-btn @click="minutesInfo" style="background: darkgoldenrod">분봉</v-btn>
          </v-col>            
        </v-row>
      </v-container>
  </div>
</template>
<script>
  import axios from "axios";

  export default {
    data() {
      return {
          code: null,
          name: null,
          now_price: null,
          high_price: null,
          low_price: null,
          open_price: null,
          max_price: null,
          min_price: null,
          volumn: null,
          total_market_value: null,
          prdy_vol_rate: null,
          charturl: null,
          data: {
            company: "",
            through_price: "",
            leave_price: "",
            resist_price: "",
            support_price: "",
            trend_high_price: "",
            trend_low_price: "",
            buy_expect_sum: ""
          }
        };
    },
    methods : {
      closePopup: function(){
        this.$emit('close-popup')
      },
      searchStock: function(data){
        axios({
          method: "GET",
          url: "http://phills2.gonetis.com:8000/stockOrder/info/",
          params:{
            company: data.company,
            app_key: this.$route.params.app_key,
            app_secret: this.$route.params.app_secret,
            access_token: this.$route.params.access_token
          }
          
        }).then(response => {
          console.log("Success", response)
          this.now_price = response.data[0].now_price
          this.high_price = response.data[0].high_price
          this.low_price = response.data[0].low_price
          this.open_price = response.data[0].open_price
          this.max_price = response.data[0].max_price
          this.min_price = response.data[0].min_price
          this.volumn = response.data[0].volumn
          this.total_market_value = response.data[0].total_market_value
          this.prdy_vol_rate = response.data[0].prdy_vol_rate
          this.code = response.data[0].code
          this.name = data.company
          this.charturl = "http://phills2.gonetis.com:8000/stockOrder/"+data.company+"/"
          window.open(this.charturl, "", "_blank"); 
        }).catch(error => {
          alert("처리 에러")
          console.log("Failed to searchStock", error.response);
        });
      },
      minutesInfo: function(){
        if (this.code != null && this.name != null){
          axios({
            method: "GET",
            url: "http://phills2.gonetis.com:8000/stockOrder/minutesInfo/",
            params:{
              code: this.code,
              company: this.name,
              app_key: this.$route.params.app_key,
              app_secret: this.$route.params.app_secret,
              access_token: this.$route.params.access_token
            }
                      
          }).then(response => {
            console.log("Success", response)
            this.charturl = "http://phills2.gonetis.com:8000/stockOrder/minutes_"+response.data[0].name+"/"
            window.open(this.charturl, "", "_blank"); 
            this.charturl = null
          }).catch(error => {
            alert("처리 에러")
            console.log("Failed to minutesInfo", error.response);
          }); 
        }
      },
      clearForm: function() {
        (this.data.company = ""),(this.data.through_price = ""),(this.data.leave_price = ""),(this.data.resist_price = ""),(this.data.support_price = ""),(this.data.trend_high_price = ""),(this.data.trend_low_price = ""),(this.data.buy_expect_sum = "");
      },
      saveInterestItem: function(){
          axios({
            method: "POST",
            url: "http://phills2.gonetis.com:8000/kis/interestItem/",
            data: {
              acct_no: this.$route.params.acct_no,
              code: this.code,
              name: this.data.company,
              through_price: this.data.through_price,
              leave_price: this.data.leave_price,
              resist_price: this.data.resist_price,
              support_price: this.data.support_price,
              trend_high_price: this.data.trend_high_price,
              trend_low_price: this.data.trend_low_price,
              buy_expect_sum: this.data.buy_expect_sum
            }, 
          }).then((response) => {
            console.log("Success", response);
            alert("관심종목등록 완료")
            this.$router.push('/').catch(()=>{})
            this.clearForm();
          }).catch((error) => {
            alert("관심종목등록 실패")
            console.log("Failed to saveInterestItem", error.response);
          }); 
      }
    }
}
</script>
  

  
  
  