<template>
<div>
    <v-container fluid>
        <v-row align="center" no-gutter>
            <v-col>
              <v-subheader>
                <v-btn @click="runStockSearch('0')" style="background: rgb(255, 0, 195)">[거래폭발]</v-btn>
                <v-btn @click="runStockSearch('1')" style="background: rgb(195, 0, 255)">[단기추세]</v-btn>
                <v-btn @click="runStockSearch('2')" style="background: rgb(135, 0, 135)">[투자혁명]</v-btn>
              </v-subheader>
            </v-col>
        </v-row>    
        <v-row align="center" no-gutter>      
            <v-col>
                [검색일자]
                <Datepicker v-model="picked" :locale="locale" :weekStartsOn="0" :inputFormat="inputFormat" :clearable="true"/>
            </v-col>
            <v-col>
                [검색명]<br />
                <select v-model="selected1" @change="fetchData()">
                    <option v-for="(d, i) in options1" :key="i" :value="d.value">
                    {{ d.text }}
                    </option>
                </select>
            </v-col>
            <v-col>
                [종목명]<br />
                <input type="text" @change="input"/>
                <button @click="fetchData">검색 수행</button>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
              <v-row>
                <v-col>검색일시</v-col>
                <v-col>검색명</v-col>
                <v-col>종목코드</v-col>
                <v-col>종목명</v-col>
                <v-col>현재가</v-col>
                <v-col>고가</v-col>
                <v-col>저가</v-col>
                <v-col>등락률</v-col>
                <v-col>거래량</v-col>
                <v-col>거래량비율</v-col>
                <v-col>시가총액</v-col>
              </v-row>
              <v-row v-for="(item, index) in contents1" v-bind:key="index">
                <v-col>{{item.search_dtm}}</v-col>
                <v-col>{{item.search_name}}</v-col>
                <v-col><a @click="doInfo(item.code, item.name)">{{item.code}}</a></v-col>
                <v-col><a @click="minutesInfo(item.code, item.name)">{{item.name}}</a></v-col>
                <v-col>{{item.current_price}}</v-col>
                <v-col>{{item.high_price}}</v-col>
                <v-col>{{item.low_price}}</v-col>
                <v-col>{{item.day_rate}}</v-col>
                <v-col>{{item.volumn}}</v-col>
                <v-col>{{item.volumn_rate}}</v-col>
                <v-col>{{item.market_total_sum}}</v-col>
              </v-row>
            </v-col>
            
        </v-row>
    </v-container>
</div>    
</template>
<script>
  import Datepicker from 'vue3-datepicker';
  import { ref, reactive, defineComponent } from 'vue';
  import {ko} from 'date-fns/locale';
  import axios from "axios";

  export default defineComponent({
    name: 'App',
    components:{
      Datepicker,   
    },
    setup(){
      const picked = ref(new Date());
      const locale = reactive(ko);
      const inputFormat = ref('yyyy-MM-dd');

      return {
        picked,
        locale,
        inputFormat,
      }
    },
    data() {
      return {
          contents1: null,
          selected1: '거래폭발',
          inputText:'',
          options1: [
            { text: '거래폭발', value: '거래폭발' },
            { text: '단기추세', value: '단기추세' },          
            { text: '투자혁명', value: '투자혁명' }
          ],
          data: {
            search_day: null,
            search_name: null,
            name: null,
          }
        };
    },
    methods : {
      runStockSearch: function(id) { 
        axios({
          method: "GET",
          url: "http://phills2.gonetis.com:8000/stockOrder/runStockSearch/",
          params: {
            search_choice: id,
            acct_no: this.$route.params.acct_no,
            app_key: this.$route.params.app_key,
            app_secret: this.$route.params.app_secret,
            access_token: this.$route.params.access_token
          }
        }).then(response => {
          console.log("Success", response)
          alert("종목검색 완료")
          this.contents1 = response.data;
        }).catch(error => {
          alert("종목검색 에러")
          console.log("Failed to get StockFundMng", error.response);
        });
      },
      fetchData: function(){
        const date1 = new Date(this.picked);
        let year = date1.getFullYear();
        let month = date1.getMonth() < 10 ? '0' + date1.getMonth()+1 : date1.getMonth()+1
        let day = date1.getDate() < 10 ? '0' + date1.getDate() : date1.getDate()

        axios({
          method: "GET",
          url: "http://phills2.gonetis.com:8000/stockOrder/stockSearch/",
          params:{
            search_day: year.toString()+month.toString()+day.toString(),
            search_name: this.selected1,
            name: this.inputText
          }
          
        }).then(response => {
          console.log("Success", response.data)
          this.contents1 = response.data;
        }).catch(error => {
          alert("처리 에러")
          console.log("Failed to fetchData", error.response);
        });
      },
      input(e){
        return this.inputText = e.target.value
        //input에 입력된 값을 inputText로 넣어주기
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
          console.log("Failed to doInfo", error.response);
        }); 
        if(this.charturl != null) 
          window.open(this.charturl, "", "_blank"); 
      },
      minutesInfo(code, name){
        axios({
          method: "GET",
          url: "http://phills2.gonetis.com:8000/stockOrder/minutesInfo/",
          params:{
            code: code.trim(),
            company: name.trim(),
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
        if(this.charturl != null) 
          window.open(this.charturl, "", "_blank"); 
      },
      created() { 
        this.fetchData();
      }
    }
  });

  
  
  
</script>