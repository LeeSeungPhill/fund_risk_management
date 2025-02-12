<template>
    <div>
      <v-container fluid>
        <v-row>
          <v-col align="center">
            <v-subheader>
              [주문]
            </v-subheader>
            <select v-model="selected">
              <option v-for="(d, i) in options" :key="i" :value="d.value">
                {{ d.text }}
              </option>
            </select>
          </v-col>
        </v-row>
        <v-row>
          <v-col align="center" cols="12" v-if="selected === 'B'">
            <label><input type="radio" value="limit" v-model="radioSel">주문가</label>
            <label>&nbsp;&nbsp;&nbsp;</label>
            <label><input type="radio" value="market" v-model="radioSel">시장가</label>
            <label>&nbsp;&nbsp;&nbsp;</label>
            <label><input type="radio" value="bflow" v-model="radioSel">시장흐름정액</label>
            <label>&nbsp;&nbsp;&nbsp;</label>
            <label><input type="radio" value="loss" v-model="radioSel">종목손실금액</label>
          </v-col>
          <v-col align="center" cols="12" v-if="selected === 'S'">
            <label><input type="radio" value="limit" v-model="radioSel">주문가</label>
            <label>&nbsp;&nbsp;&nbsp;</label>
            <label><input type="radio" value="market" v-model="radioSel">시장가</label>
            <label>&nbsp;&nbsp;&nbsp;</label>
            <label><input type="radio" value="sflow" v-model="radioSel">시장기준수량</label>
            <label>&nbsp;&nbsp;&nbsp;</label>
            <label><input type="radio" value="half" v-model="radioSel">보유물량절반</label>
          </v-col>
        </v-row>
        <v-row v-if="selected === 'B'">
          <v-col md="5">
            <v-text-field v-model="data.code" :counter="6" label="종목코드" required></v-text-field>
          </v-col>
          <v-col md="5">
            <v-text-field v-model="data.name" label="종목명" required></v-text-field>
          </v-col>    
          <v-col v-show="radioSel != 'market'" md="5">
            <v-text-field v-model="data.buy_price" label="주문단가" ></v-text-field>
          </v-col>    
          <v-col v-show="radioSel === 'limit' || radioSel === 'market'" md="5">
            <v-text-field v-model="data.buy_amount" label="주문수량" ></v-text-field>
          </v-col>
          <v-col md="5">
            <v-text-field v-model="data.loss_price" label="손절가" ></v-text-field>
          </v-col>
          <v-col md="5">
            <v-text-field v-model="data.target_price" label="목표가" ></v-text-field>
          </v-col>
        </v-row>
        <v-row v-if="selected === 'S'">
          <v-col md="5">
            <v-text-field v-model="data.code" :counter="6" label="종목코드" required></v-text-field>
          </v-col>
          <v-col md="5">
            <v-text-field v-model="data.name" label="종목명" required></v-text-field>
          </v-col>    
          <v-col v-show="radioSel != 'market'" md="5">
            <v-text-field v-model="data.sell_price" label="매도단가" ></v-text-field>
          </v-col>    
          <v-col v-show="radioSel === 'limit' || radioSel === 'market'" md="5">
            <v-text-field v-model="data.sell_amount" label="매도수량" ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn @click="clearForm" style="background: gray">초기화</v-btn>
            <v-btn @click="sendForm" style="background: mediumaquamarine">저장</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </div>
      
</template>
<script>
  import axios from "axios";
  
  let url = "http://phills2.asuscomm.com:8000/kis/stockOrder/"; //장고 서버 주소

  export default {
    name: 'App',
    data: () => {
        return {
            stock_asset_num: null,
            stock_asset_risk_num: null,
            radioSel: 'limit',
            selected: 'B',
            options: [
              { text: '매수', value: 'B' },
              { text: '매도', value: 'S' }          
            ],
            data: {
                code: "",
                name: "",
                buy_price: "",
                buy_amount: "",
                sell_price: "",
                sell_amount: "",
                loss_price: "",
                target_price: "",
            },
        };
    },
    methods: {
      sendForm: function() { 
        if (this.radioSel == 'market'){
          this.data.buy_price = '-1'
          this.data.sell_price = '-1'
        }else if (this.radioSel == 'bflow'){
          this.data.buy_amount = '0'
          this.stock_asset_num = '0'
        }else if (this.radioSel == 'loss'){
          this.data.buy_amount = '0'
        }else if (this.radioSel == 'sflow'){
          this.data.sell_amount = '0'
        }else if (this.radioSel == 'half'){
          this.data.sell_amount = '0'
          this.stock_asset_num = '0'
        }

        if (this.selected == 'B'){
          axios({
            method: "POST",
            url: url,
            data: {
              acct_no: this.$route.params.acct_no,
              code: this.data.code,
              name: this.data.name,
              buy_price: this.data.buy_price,
              buy_amount: this.data.buy_amount,
              sell_price: 0,
              sell_amount: 0,
              loss_price: this.data.loss_price,
              target_price: this.data.target_price,
              trading_type: "B",
              asset_risk_num: this.stock_asset_risk_num,
              asset_num: this.stock_asset_num,
              proc_yn: "N",
              order_no: "0",
              order_stat: "01",
              total_complete_qty: 0,
              remain_qty: 0
            }, 
          }).then((response) => {
            console.log("Success", response);
            alert("주문저장 완료")
            this.$router.push('/').catch(()=>{})
            this.clearForm();
          }).catch((error) => {
            alert("주문저장 실패")
            console.log("Failed to StockOrder Save", error.response);
          });
        }else{
          axios({
            method: "POST",
            url: url,
            data: {
              acct_no: this.$route.params.acct_no,
              code: this.data.code,
              name: this.data.name,
              buy_price: 0,
              buy_amount: 0,
              sell_price: this.data.sell_price,
              sell_amount: this.data.sell_amount,
              loss_price: 0,
              target_price: 0,
              trading_type: "S",
              asset_risk_num: this.stock_asset_risk_num,
              asset_num: this.stock_asset_num,
              proc_yn: "N",
              order_no: "0",
              order_stat: "01",
              total_complete_qty: 0,
              remain_qty: 0
            }, 
          }).then((response) => {
            console.log("Success", response);
            alert("주문저장 완료")
            this.$router.push('/').catch(()=>{})
            this.clearForm();
          }).catch((error) => {
            alert("주문저장 실패")
            console.log("Failed to StockOrder Save", error.response);
          });
        }
      },
      clearForm: function() {
        (this.data.code = ""),(this.data.name = ""),(this.data.buy_price = ""),(this.data.buy_amount = ""),(this.data.sell_price = ""),(this.data.sell_amount = ""),(this.data.loss_price = ""),(this.data.target_price = "");
      },
      getAssetInfo() {
        axios({
          method: "GET",
          url: "http://phills2.asuscomm.com:8000/stockOrder/assetInfo/",
          params:{
            acct_no: this.$route.params.acct_no,
            app_key: this.$route.params.app_key,
            app_secret: this.$route.params.app_secret,
            access_token: this.$route.params.access_token
          }
        }).then(response => {
          console.log("Success", response);
          this.stock_asset_num = response.data[0].stock_asset_num
          this.stock_asset_risk_num = response.data[0].stock_asset_risk_num
        }).catch(error => {
          alert("처리 에러")
          console.log("Failed to get AssetInfo", error.response);
        });
      },
    },
    created(){
      this.getAssetInfo();
    }
  }
  
</script>
<style>
.popup-view{
  opacity: 0;
  display: none;
  visibility: hidden;
}
.active{
  opacity: 1;
  display: block;
  visibility: visible;
}
</style>