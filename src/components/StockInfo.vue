<template>
  <div class="close-image">
      <v-container>
        <v-row>
          <v-col>
            <v-text-field v-model="data.company" label="종목명" @keypress.enter="searchStock(data);"></v-text-field>
          </v-col>    
          <v-col>
            <v-btn @click="closePopup()" style="background: gray">닫기</v-btn>
          </v-col>   
        </v-row>
        <v-row>
          <v-col>종목코드 : {{code}}</v-col>
          <v-col>현재가 : {{now_price}}</v-col>
          <v-col>최고가 : {{high_price}}</v-col>
          <v-col>최저가 : {{low_price}}</v-col>
        </v-row>
        <v-row>
          <v-col>시가 : {{open_price}}</v-col>
          <v-col>상한가 : {{max_price}}</v-col>
          <v-col>하한가 : {{min_price}}</v-col>
          <v-col>거래량 : {{volumn}}</v-col>
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
          now_price: null,
          high_price: null,
          low_price: null,
          open_price: null,
          max_price: null,
          min_price: null,
          volumn: null,
          company_name: null,
          charturl: null,
          data: {
            company: ""
            
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
          this.code = response.data[0].code
          this.charturl = "http://phills2.gonetis.com:8000/stockOrder/"+data.company+"/"
          window.open(this.charturl, "", "_blank"); 
        }).catch(error => {
          alert("처리 에러")
          console.log("Failed to searchStock", error.response);
        });
      },
      openChart: function(){
        if(this.charturl != null) 
          window.open(this.charturl, "", "_blank"); 
      },

    }
}
</script>
  

  
  
  