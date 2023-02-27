<template>
  <div>
    <v-container>
        <v-row align="center">
          <v-col>
            <v-subheader>
              [장중 투자자별 매매 상위 - {{this.tr_day}} / {{this.tr_time}} 기준]
            </v-subheader>
          </v-col>
          <v-col>
            <select v-model="selected1" @change="fetchData">
              <option v-for="(d, i) in options1" :key="i" :value="d.value">
                {{ d.text }}
              </option>
            </select>
          </v-col>
          <v-col>
            <select v-model="selected2" @change="fetchData">
              <option v-for="(d, i) in options2" :key="i" :value="d.value">
                {{ d.text }}
              </option>
            </select>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-row>
              <v-col>종목코드</v-col>
              <v-col>종목명</v-col>
              <v-col>수급주체</v-col>
              <v-col>거래수량</v-col>
            </v-row>
            <v-row v-for="(item, index) in contents1" v-bind:key="index">
              <v-col><a @click="doInfo(item.code, item.name)">{{item.code}}</a></v-col>
              <v-col><a @click="doInfo(item.code, item.name)">{{item.name}}</a></v-col>
              <v-col>{{item.tr_subject}}</v-col>
              <v-col>{{item.volumn}}</v-col>
            </v-row>
          </v-col>
          <v-col>
            <v-row>
              <v-col>종목코드</v-col>
              <v-col>종목명</v-col>
              <v-col>수급주체</v-col>
              <v-col>거래수량</v-col>
            </v-row>
            <v-row v-for="(item, index) in contents2" v-bind:key="index">
              <v-col><a @click="doInfo(item.code, item.name)">{{item.code}}</a></v-col>
              <v-col><a @click="doInfo(item.code, item.name)">{{item.name}}</a></v-col>
              <v-col>{{item.tr_subject}}</v-col>
              <v-col>{{item.volumn}}</v-col>
            </v-row>
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
          contents1: null,
          contents2: null,
          tr_day: null,
          tr_time: null,
          charturl: null,
          selected1: '순매수',
          options1: [
            { text: '순매수', value: '순매수' },
            { text: '순매도', value: '순매도' }          
          ],
          selected2: '코스피',
          options2: [
            { text: '코스피', value: '코스피' },
            { text: '코스닥', value: '코스닥' }          
          ],  
          data: {
            tr_subject: null,
            tr_type: null,
            market_type: null,
          }
        };
    },
    methods : {
      fetchData: function(){
        axios({
          method: "GET",
          url: "http://phills2.gonetis.com:8000/stockOrder/subTotal/",
          params:{
            tr_subject: '기관',
            tr_type: this.selected1,
            market_type: this.selected2            
          }
          
        }).then(response => {
          console.log("Success", response.data)
          this.contents1 = response.data;
          this.tr_day = response.data[0].tr_day;
          this.tr_time = response.data[0].tr_time;
        }).catch(error => {
          alert("처리 에러")
          console.log("Failed to searchStock", error.response);
        });
        axios({
          method: "GET",
          url: "http://phills2.gonetis.com:8000/stockOrder/subTotal/",
          params:{
            tr_subject: '외국인',
            tr_type: this.selected1,
            market_type: this.selected2            
          }
          
        }).then(response => {
          console.log("Success", response.data)
          this.contents2 = response.data;
        }).catch(error => {
          alert("처리 에러")
          console.log("Failed to searchStock", error.response);
        });
      },
      doInfo(code, name){
        axios({
            method: "GET",
            url: "http://phills2.gonetis.com:8000/stockOrder/chart/",
            params:{
              code: code.trim(),
              company: name.trim(),
            }
            
          }).then(response => {
            console.log("Success", response)
            this.charturl = "http://phills2.gonetis.com:8000/stockOrder/"+response.data[0].name+"/"
            window.open(this.charturl, "", "_blank"); 
            this.charturl = null
          }).catch(error => {
            alert("처리 에러")
            console.log("Failed to searchStock", error.response);
          }); 
        if(this.charturl != null) 
            window.open(this.charturl, "", "_blank"); 
      },
    },
    created() { 
      this.fetchData();
    }
  }
</script>
  

  
  
  