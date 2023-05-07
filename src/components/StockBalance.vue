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
          <v-col>이탈가격</v-col>
          <v-col>목표가격</v-col>
          <v-col>매매계획</v-col>
          <v-col>자산번호</v-col>
        </v-row>
        <v-row v-for="item in contents" v-bind:key="item.name">
          <v-col><a @click="doInfo(item.name)">{{item.name}}</a></v-col>
          <v-col><a @click="minutesInfo(item.name)">{{item.purchase_price}}</a></v-col>
          <v-col>{{item.current_price}}</v-col>
          <v-col>{{item.earnings_rate}}</v-col>
          <v-col>{{item.purchase_amount}}</v-col>
          <v-col>{{item.purchase_sum}}</v-col>
          <v-col>{{item.eval_sum}}</v-col>
          <v-col>{{item.valuation_sum}}</v-col>
          <v-col v-show="!item.is_hidden1">
            <a @click="item.is_hidden1 = !item.is_hidden1;onlyItem(item, contents)"><div v-if="item.D_loss_price==='1'" class="down">{{item.end_loss_price}}</div><div v-else>{{item.end_loss_price}}</div></a>
          </v-col>    
          <v-col v-show="item.is_hidden1">                    
            <v-form>
              <v-container>
                <v-row>
                  <v-col>
                    <v-text-field v-model="data.end_loss_price" label="이탈가격" ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-btn @click="item.is_hidden1 = !item.is_hidden1;updateItem1(data, item.id, item.end_target_price);" v-show="item.is_hidden1" color="#4CAF50">변경</v-btn>
                  </v-col>   
                </v-row>
              </v-container>        
            </v-form>
          </v-col>
          <v-col v-show="!item.is_hidden2">
            <a @click="item.is_hidden2 = !item.is_hidden2;onlyItem(item, contents)"><div v-if="item.K_target_price==='1'" class="up">{{item.end_target_price}}</div><div v-else>{{item.end_target_price}}</div></a>
          </v-col>    
          <v-col v-show="item.is_hidden2">                    
            <v-form>
              <v-container>
                <v-row>
                  <v-col>
                    <v-text-field v-model="data.end_target_price" label="목표가격" ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-btn @click="item.is_hidden2 = !item.is_hidden2;updateItem2(data, item.id, item.end_loss_price);" v-show="item.is_hidden2" color="#4CAF50">변경</v-btn>
                  </v-col>   
                </v-row>
              </v-container>        
            </v-form>
          </v-col>          
          <v-col v-show="!item.is_hidden3">
            <a @click="item.is_hidden3 = !item.is_hidden3;onlyItem(item, contents)">[{{item.trading_plan}}]</a>
          </v-col>    
          <v-col v-show="item.is_hidden3">                    
            <v-form>
              <v-container>
                <v-row>
                  <v-col>
                    <select v-model="selected">
                      <option v-for="(d, i) in options" :key="i" :value="d.value">
                        {{ d.text }}
                      </option>
                    </select>
                  </v-col>
                  <v-col>
                    <v-btn @click="item.is_hidden3 = !item.is_hidden3;updateItem3(item.id, item.end_loss_price, item.end_target_price);" v-show="item.is_hidden3" color="#4CAF50">변경</v-btn>
                  </v-col>   
                </v-row>
              </v-container>        
            </v-form>
          </v-col>          
          <v-col>{{item.asset_num}}</v-col>
        </v-row>
    </v-container>      
  </div>
</template>

<script>
import axios from "axios";

let url = "http://phills2.gonetis.com/stockBalance/balanceList/"; //장고 서버 주소

export default {
  data() {
    return {
      contents: null,
      company_name: null,
      charturl: null,
      selected: 'H',
      options: [
        { text: '매수', value: 'B' },
        { text: '매도', value: 'S' },
        { text: '보유', value: 'H' }          
      ],
      data: {
        end_loss_price: "",
        end_target_price: "",
        trading_plan: "",
      },
    }
  },
  name: 'StockBalance',
  methods: {
    doInfo(name){
      axios({
          method: "GET",
          url: "http://phills2.gonetis.com/stockBalance/info/",
          params:{
            company: name,
          }
          
        }).then(response => {
          console.log("Success", response)
          this.company_name = response.data[0].name
          
          if(name == this.company_name) {
            this.charturl = "http://phills2.gonetis.com/stockBalance/"+this.company_name+"/"
            window.open(this.charturl, "", "_blank"); 
            this.company_name = null
            this.charturl = null
          }
        }).catch(error => {
          alert("처리 에러")
          console.log("Failed to doInfo", error.response);
        }); 
      if(this.charturl != null) 
          window.open(this.charturl, "", "_blank"); 
    },
    minutesInfo(name){
      axios({
          method: "GET",
          url: "http://phills2.gonetis.com/stockBalance/minutesInfo/",
          params:{
            company: name,
            app_key: this.$route.params.app_key,
            app_secret: this.$route.params.app_secret,
            access_token: this.$route.params.access_token
          }
          
        }).then(response => {
          console.log("Success", response)
          this.company_name = response.data[0].name
          
          if(name == this.company_name) {
            this.charturl = "http://phills2.gonetis.com/stockBalance/minutes_"+this.company_name+"/"
            window.open(this.charturl, "", "_blank"); 
            this.company_name = null
            this.charturl = null
          }
        }).catch(error => {
          alert("처리 에러")
          console.log("Failed to minutesInfo", error.response);
        }); 
      if(this.charturl != null) 
          window.open(this.charturl, "", "_blank"); 
    },
    formatDate(str){
      return str.split('T')[0];
    },
    onlyItem: function(data, contents){
      // 한개의 리스트만 보이도록
      for (var index in contents){
        data.id != contents[index].id ? (contents[index].is_hidden = false) : "";
      }
    },
    updateItem1: function(data, id, end_target_price){
      if(end_target_price == null){
        end_target_price = 0
      }
      axios({
        method: "GET",
        url: "http://phills2.gonetis.com/stockBalance/update/",
        params:{
          acct_no: this.$route.params.acct_no,
          id: id,
          end_loss_price: data.end_loss_price,
          end_target_price: end_target_price,
          trading_plan: this.selected,
        }
      }).then(response => {
        console.log("Success", response)
        this.data.end_loss_price = ""
        this.contents = response.data;
      }).catch(error => {
        alert("처리 에러")
        console.log("Failed to updateItem1", error.response);
      });
    },
    updateItem2: function(data, id, end_loss_price){
      if(end_loss_price == null){
        end_loss_price = 0
      }
      axios({
        method: "GET",
        url: "http://phills2.gonetis.com/stockBalance/update/",
        params:{
          acct_no: this.$route.params.acct_no,
          id: id,
          end_loss_price: end_loss_price,
          end_target_price: data.end_target_price,
          trading_plan: this.selected,
        }
      }).then(response => {
        console.log("Success", response)
        this.data.end_target_price = ""
        this.contents = response.data;
      }).catch(error => {
        alert("처리 에러")
        console.log("Failed to updateItem2", error.response);
      });
    },
    updateItem3: function(id, end_loss_price, end_target_price){
      if(end_loss_price == null){
        end_loss_price = 0
      }
      if(end_target_price == null){
        end_target_price = 0
      }
      axios({
        method: "GET",
        url: "http://phills2.gonetis.com/stockBalance/update/",
        params:{
          acct_no: this.$route.params.acct_no,
          id: id,
          end_loss_price: end_loss_price,
          end_target_price: end_target_price,
          trading_plan: this.selected,
        }
      }).then(response => {
        console.log("Success", response)
        this.data.trading_plan = ""
        this.contents = response.data;
      }).catch(error => {
        alert("처리 에러")
        console.log("Failed to updateItem3", error.response);
      });
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
    },
    marketReg(){
      axios({
      method: "GET",
      url: "http://phills2.gonetis.com/stockFundMng/marketReg/",
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
    this.marketReg();
  }

  
}
</script>
<style scoped>
.up {
    font-weight: bold;
    color: red;
}
.down {
  font-weight: bold;
  color: blue;
}
</style>