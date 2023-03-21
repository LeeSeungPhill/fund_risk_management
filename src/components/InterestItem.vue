<template>
    <div class="close-image">
        <v-container>
            <v-row>
                <v-col>종목코드</v-col>
                <v-col>종목명</v-col>
                <v-col>현재가격</v-col>
                <v-col>돌파가격</v-col>
                <v-col>이탈가격</v-col>
                <v-col>저항가격</v-col>
                <v-col>지지가격</v-col>
                <v-col>추세상단가격</v-col>
                <v-col>추세하단가격</v-col>
                <v-col>변경일자</v-col>
            </v-row>
            <v-row v-for="(item, index) in contents" v-bind:key="index">                
                <v-col><a @click="doInfo(item.code, item.name)">{{item.code}}</a></v-col>
                <v-col><a @click="minutesInfo(item.code, item.name)">{{item.name}}</a></v-col>
                <v-col>{{item.stck_prpr}}</v-col>
                <v-col v-show="!item.is_hidden1">
                    <a @click="item.is_hidden1 = !item.is_hidden1;onlyItem(item, contents)"><div v-if="item.K_through_price==='1'"><font color="blue">{{item.through_price}}</font></div><div v-else>{{item.through_price}}</div></a>
                </v-col>    
                <v-col v-show="item.is_hidden1">                    
                    <v-form>
                        <v-container>
                            <v-row>
                                <v-col>
                                    <v-text-field v-model="data.through_price" label="돌파가격" ></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-btn @click="item.is_hidden1 = !item.is_hidden1;updateItem1(data, item.id, item.leave_price, item.resist_price, item.support_price, item.trend_high_price, item.trend_low_price);" v-show="item.is_hidden1" color="#4CAF50">변경</v-btn>
                                </v-col>   
                            </v-row>
                        </v-container>        
                    </v-form>
                </v-col>
                <v-col v-show="!item.is_hidden2">
                    <a @click="item.is_hidden2 = !item.is_hidden2;onlyItem(item, contents)"><div v-if="item.D_leave_price==='1'"><font color="red">{{item.leave_price}}</font></div><div v-else>{{item.leave_price}}</div></a>
                </v-col>
                <v-col v-show="item.is_hidden2">                    
                    <v-form>
                        <v-container>
                            <v-row>
                                <v-col>
                                    <v-text-field v-model="data.leave_price" label="이탈가격" ></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-btn @click="item.is_hidden2 = !item.is_hidden2;updateItem2(data, item.id, item.through_price, item.resist_price, item.support_price, item.trend_high_price, item.trend_low_price);" v-show="item.is_hidden2" color="#4CAF50">변경</v-btn>
                                </v-col>   
                            </v-row>
                        </v-container>        
                    </v-form>
                </v-col>
                <v-col v-show="!item.is_hidden3">
                    <a @click="item.is_hidden3 = !item.is_hidden3;onlyItem(item, contents)"><div v-if="item.K_resist_price==='1'"><font color="blue">{{item.resist_price}}</font></div><div v-else>{{item.resist_price}}</div></a>
                </v-col>
                <v-col v-show="item.is_hidden3">                    
                    <v-form>
                        <v-container>
                            <v-row>
                                <v-col>
                                    <v-text-field v-model="data.resist_price" label="저항가격" ></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-btn @click="item.is_hidden3 = !item.is_hidden3;updateItem3(data, item.id, item.through_price, item.leave_price, item.support_price, item.trend_high_price, item.trend_low_price);" v-show="item.is_hidden3" color="#4CAF50">변경</v-btn>
                                </v-col>   
                            </v-row>
                        </v-container>        
                    </v-form>
                </v-col>
                <v-col v-show="!item.is_hidden4">
                    <a @click="item.is_hidden4 = !item.is_hidden4;onlyItem(item, contents)"><div v-if="item.D_support_price==='1'"><font color="red">{{item.support_price}}</font></div><div v-else>{{item.support_price}}</div></a>
                </v-col>
                <v-col v-show="item.is_hidden4">                    
                    <v-form>
                        <v-container>
                            <v-row>
                                <v-col>
                                    <v-text-field v-model="data.support_price" label="지지가격" ></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-btn @click="item.is_hidden4 = !item.is_hidden4;updateItem4(data, item.id, item.through_price, item.leave_price, item.resist_price, item.trend_high_price, item.trend_low_price);" v-show="item.is_hidden4" color="#4CAF50">변경</v-btn>
                                </v-col>   
                            </v-row>
                        </v-container>        
                    </v-form>
                </v-col>
                <v-col v-show="!item.is_hidden5">
                    <a @click="item.is_hidden5 = !item.is_hidden5;onlyItem(item, contents)"><div v-if="item.K_trend_high_price==='1'"><font color="blue">{{item.trend_high_price}}</font></div><div v-else>{{item.trend_high_price}}</div></a>
                </v-col>
                <v-col v-show="item.is_hidden5">                    
                    <v-form>
                        <v-container>
                            <v-row>
                                <v-col>
                                    <v-text-field v-model="data.trend_high_price" label="추세상단가격" ></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-btn @click="item.is_hidden5 = !item.is_hidden5;updateItem5(data, item.id, item.through_price, item.leave_price, item.resist_price, item.support_price, item.trend_low_price);" v-show="item.is_hidden5" color="#4CAF50">변경</v-btn>
                                </v-col>   
                            </v-row>
                        </v-container>        
                    </v-form>
                </v-col>
                <v-col v-show="!item.is_hidden6">
                    <a @click="item.is_hidden6 = !item.is_hidden6;onlyItem(item, contents)"><div v-if="item.D_trend_low_price==='1'"><font color="red">{{item.trend_low_price}}</font></div><div v-else>{{item.trend_low_price}}</div></a>
                </v-col>
                <v-col v-show="item.is_hidden6">                    
                    <v-form>
                        <v-container>
                            <v-row>
                                <v-col>
                                    <v-text-field v-model="data.trend_low_price" label="추세하단가격" ></v-text-field>
                                </v-col>
                                <v-col>
                                    <v-btn @click="item.is_hidden6 = !item.is_hidden6;updateItem6(data, item.id, item.through_price,  item.leave_price, item.resist_price, item.support_price, item.trend_high_price);" v-show="item.is_hidden6" color="#4CAF50">변경</v-btn>
                                </v-col>   
                            </v-row>
                        </v-container>        
                    </v-form>
                </v-col>
                <v-col>
                    {{formatDate(item.last_chg_date)}}
                    <v-btn @click="deleteItem(item.id)" color="#F44336">삭제</v-btn> 
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
                contents: null,
                charturl: null,
                data: {
                    through_price: "",
                    leave_price: "",
                    resist_price: "",
                    support_price: "",
                    trend_high_price: "",
                    trend_low_price: "",
                },
            };
        },
        methods : {
            formatDate(str){
                return str.split('T')[0];
            },
            fetchData: function(){
                axios({
                    method: "GET",
                    url: "http://phills2.gonetis.com:8000/interestItem/list/",
                    params:{
                        acct_no: this.$route.params.acct_no,
                        app_key: this.$route.params.app_key,
                        app_secret: this.$route.params.app_secret,
                        access_token: this.$route.params.access_token
                    }
                
                }).then(response => {
                    console.log("Success", response.data)
                    this.contents = response.data;
                }).catch(error => {
                    alert("처리 에러")
                    console.log("Failed to fetchData", error.response);
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
            deleteItem: function(id){
                axios({
                    method: "DELETE",
                    url: "http://phills2.gonetis.com:8000/kis/interestItem/" + id + "/", // http://phills2.gonetis.com:8000/kis/interestItem/1 로 delete 이벤트 전송
                }).then((response) => {
                    console.log("Success", response);
                    this.fetchData()
                }).catch((error) => {
                console.log("Failed to deleteItem", error.response);
                });
            },
            onlyItem: function(data, contents){
                // 한개의 리스트만 보이도록
                for (var index in contents){
                    data.id != contents[index].id ? (contents[index].is_hidden = false) : "";
                }
            },
            updateItem1: function(data, id, leave_price, resist_price, support_price, trend_high_price, trend_low_price){
                axios({
                method: "GET",
                url: "http://phills2.gonetis.com:8000/interestItem/update/",
                params:{
                    acct_no: this.$route.params.acct_no,
                    app_key: this.$route.params.app_key,
                    app_secret: this.$route.params.app_secret,
                    access_token: this.$route.params.access_token,
                    id: id,
                    through_price: data.through_price,
                    leave_price: leave_price,
                    resist_price: resist_price,
                    support_price: support_price,
                    trend_high_price: trend_high_price,
                    trend_low_price: trend_low_price
                }
                
                }).then(response => {
                    console.log("Success", response)
                    this.data.through_price = ""
                    this.contents = response.data;
                }).catch(error => {
                    alert("처리 에러")
                    console.log("Failed to updateItem1", error.response);
                });
            },
            updateItem2: function(data, id, through_price, resist_price, support_price, trend_high_price, trend_low_price){
                axios({
                method: "GET",
                url: "http://phills2.gonetis.com:8000/interestItem/update/",
                params:{
                    acct_no: this.$route.params.acct_no,
                    app_key: this.$route.params.app_key,
                    app_secret: this.$route.params.app_secret,
                    access_token: this.$route.params.access_token,                    
                    id: id,
                    through_price: through_price,
                    leave_price: data.leave_price,
                    resist_price: resist_price,
                    support_price: support_price,
                    trend_high_price: trend_high_price,
                    trend_low_price: trend_low_price
                }
                
                }).then(response => {
                    console.log("Success", response)
                    this.data.leave_price = ""
                    this.contents = response.data;
                }).catch(error => {
                    alert("처리 에러")
                    console.log("Failed to updateItem2", error.response);
                });
            },
            updateItem3: function(data, id, through_price, leave_price, support_price, trend_high_price, trend_low_price){
                axios({
                method: "GET",
                url: "http://phills2.gonetis.com:8000/interestItem/update/",
                params:{
                    acct_no: this.$route.params.acct_no,
                    app_key: this.$route.params.app_key,
                    app_secret: this.$route.params.app_secret,
                    access_token: this.$route.params.access_token,                    
                    id: id,
                    through_price: through_price,
                    leave_price: leave_price,
                    resist_price: data.resist_price,
                    support_price: support_price,
                    trend_high_price: trend_high_price,
                    trend_low_price: trend_low_price
                }
                
                }).then(response => {
                    console.log("Success", response)
                    this.data.resist_price = ""
                    this.contents = response.data;
                }).catch(error => {
                    alert("처리 에러")
                    console.log("Failed to updateItem3", error.response);
                });
            },
            updateItem4: function(data, id, through_price, leave_price, resist_price, trend_high_price, trend_low_price){
                axios({
                method: "GET",
                url: "http://phills2.gonetis.com:8000/interestItem/update/",
                params:{
                    acct_no: this.$route.params.acct_no,
                    app_key: this.$route.params.app_key,
                    app_secret: this.$route.params.app_secret,
                    access_token: this.$route.params.access_token,                    
                    id: id,
                    through_price: through_price,
                    leave_price: leave_price,
                    resist_price: resist_price,
                    support_price: data.support_price,
                    trend_high_price: trend_high_price,
                    trend_low_price: trend_low_price
                }
                
                }).then(response => {
                    console.log("Success", response)
                    this.data.support_price = ""
                    this.contents = response.data;
                }).catch(error => {
                    alert("처리 에러")
                    console.log("Failed to updateItem4", error.response);
                });
            },  
            updateItem5: function(data, id, through_price, leave_price, resist_price, support_price, trend_low_price){
                axios({
                method: "GET",
                url: "http://phills2.gonetis.com:8000/interestItem/update/",
                params:{
                    acct_no: this.$route.params.acct_no,
                    app_key: this.$route.params.app_key,
                    app_secret: this.$route.params.app_secret,
                    access_token: this.$route.params.access_token,                    
                    id: id,
                    through_price: through_price,
                    leave_price: leave_price,
                    resist_price: resist_price,
                    support_price: support_price,
                    trend_high_price: data.trend_high_price,
                    trend_low_price: trend_low_price
                }
                
                }).then(response => {
                    console.log("Success", response)
                    this.data.trend_high_price = ""
                    this.contents = response.data;
                }).catch(error => {
                    alert("처리 에러")
                    console.log("Failed to updateItem5", error.response);
                });
            },
            updateItem6: function(data, id, through_price, leave_price, resist_price, support_price, trend_high_price){
                axios({
                method: "GET",
                url: "http://phills2.gonetis.com:8000/interestItem/update/",
                params:{
                    acct_no: this.$route.params.acct_no,
                    app_key: this.$route.params.app_key,
                    app_secret: this.$route.params.app_secret,
                    access_token: this.$route.params.access_token,                    
                    id: id,
                    through_price: through_price,
                    leave_price: leave_price,
                    resist_price: resist_price,
                    support_price: support_price,
                    trend_high_price: trend_high_price,
                    trend_low_price: data.trend_low_price
                }
                
                }).then(response => {
                    console.log("Success", response)
                    this.data.trend_low_price = ""
                    this.contents = response.data;
                }).catch(error => {
                    alert("처리 에러")
                    console.log("Failed to updateItem6", error.response);
                });
            },                                              
        },
        created() { 
            this.fetchData();
        }
    }
  </script>
    
  
    
    
    