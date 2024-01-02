<template>
    <div class="close-image">
        <v-container fluid>
            <v-row no-gutter>
                <v-col align="left">
                    <v-subheader>
                        [관심 종목]    
                    </v-subheader>
                </v-col>
                <v-col align="right">
                    <v-btn @click="runDelete()" style="background: #4c6351">[삭제]</v-btn>
                </v-col>
            </v-row>    
            <ag-grid-vue 
                style="width: 100%; height: 300px;" 
                class="ag-theme-balham" 
                :columnDefs="colDefs" 
                :rowData="rowData" 
                :paginationAutoPageSize="true"
                :pagination="true"
                :defaultColDef="defaultColDef"
                @cellClicked="onCellClicked"
            />
        </v-container>
    </div>
</template>
<script>
    import { ref, defineComponent } from 'vue';
    import axios from "axios";
    import {AgGridVue} from 'ag-grid-vue3';
    import 'ag-grid-community/styles/ag-grid.css';
    import 'ag-grid-community/styles/ag-theme-balham.css';
    import 'ag-grid-community/styles/ag-theme-quartz.css';

    export default defineComponent({
        name: 'App',
        components:{
            AgGridVue
        },
        setup(){

        const defaultColDef = ref({
            flex: 1,
            minWidth: 100,
            //editable: true,
        });

        const colDefs = ref([
            {headerName: 'No', colId: 0, valueGetter: (params) => { return params.node.rowIndex + 1 } },
            {headerName: '선택', field: 'chk', editable: true, cellRenderer:'agCheckboxCellRenderer', cellEditor: 'agCheckboxCellEditor'},
            {headerName: '종목코드', field: 'code'},
            {headerName: '종목명', field: 'name'},
            {headerName: '시가총액', field: 'total_market_value', valueFormatter: (params) => {return params.value.toLocaleString() + '억원';},},
            {headerName: '현재가', field: 'stck_prpr', valueFormatter: (params) => {return '￦' + params.value.toLocaleString();},},
            {headerName: '거래량비율', field: 'prdy_vol_rate', valueFormatter: (params) => {return  params.value.toLocaleString() + '%';},},
            {headerName: '돌파가격', field: 'through_price', cellStyle: params=> {
                if(params.data.K_through_price === '1' ) {
                    return {color:'red', 'font-weight': 'bold'}
                }
            }, valueSetter: params => {
                
                params.data.through_price = params.newValue;

                axios({
                method: "GET",
                url: "http://phills2.gonetis.com:8000/interestItem/update/",
                params:{
                    id: params.data.id,
                    through_price: params.newValue,
                    leave_price: params.data.leave_price,
                    resist_price: params.data.resist_price,
                    support_price: params.data.support_price,
                    trend_high_price: params.data.trend_high_price,
                    trend_low_price: params.data.trend_low_price,
                    buy_expect_sum: params.data.buy_expect_sum
                }
                
                }).then(response => {
                    console.log("Success", response)
                }).catch(error => {
                    alert("처리 에러")
                    console.log("Failed to updateItem1", error.response);
                });
                return true;
            }, editable: true, cellEditor: 'agTextCellEditor', cellEditorParams: { min: 0, max: 9999999 }, valueFormatter: (params) => {return '￦' + params.value.toLocaleString();},},
            {headerName: '이탈가격', field: 'leave_price', cellStyle: params=> {
                if(params.data.D_leave_price === '1' ) {
                    return {color:'blue', 'font-weight': 'bold'}
                }
            }, valueSetter: params => {
                
                params.data.leave_price = params.newValue;

                axios({
                method: "GET",
                url: "http://phills2.gonetis.com:8000/interestItem/update/",
                params:{
                    id: params.data.id,
                    through_price: params.data.through_price,
                    leave_price: params.newValue,
                    resist_price: params.data.resist_price,
                    support_price: params.data.support_price,
                    trend_high_price: params.data.trend_high_price,
                    trend_low_price: params.data.trend_low_price,
                    buy_expect_sum: params.data.buy_expect_sum
                }
                
                }).then(response => {
                    console.log("Success", response)
                }).catch(error => {
                    alert("처리 에러")
                    console.log("Failed to updateItem1", error.response);
                });
                return true;
            }, editable: true, cellEditor: 'agTextCellEditor', cellEditorParams: { min: 0, max: 9999999 }, valueFormatter: (params) => {return '￦' + params.value.toLocaleString();},},
            {headerName: '저항가격', field: 'resist_price', cellStyle: params=> {
                if(params.data.K_resist_price === '1' ) {
                    return {color:'red', 'font-weight': 'bold'}
                }
            }, valueSetter: params => {
                
                params.data.resist_price = params.newValue;

                axios({
                method: "GET",
                url: "http://phills2.gonetis.com:8000/interestItem/update/",
                params:{
                    id: params.data.id,
                    through_price: params.data.through_price,
                    leave_price: params.data.leave_price,
                    resist_price: params.newValue,
                    support_price: params.data.support_price,
                    trend_high_price: params.data.trend_high_price,
                    trend_low_price: params.data.trend_low_price,
                    buy_expect_sum: params.data.buy_expect_sum
                }
                
                }).then(response => {
                    console.log("Success", response)
                }).catch(error => {
                    alert("처리 에러")
                    console.log("Failed to updateItem1", error.response);
                });
                return true;
            }, editable: true, cellEditor: 'agTextCellEditor', cellEditorParams: { min: 0, max: 9999999 }, valueFormatter: (params) => {return '￦' + params.value.toLocaleString();},},
            {headerName: '지지가격', field: 'support_price', cellStyle: params=> {
                if(params.data.D_support_price === '1' ) {
                    return {color:'blue', 'font-weight': 'bold'}
                }
            }, valueSetter: params => {
                
                params.data.support_price = params.newValue;

                axios({
                method: "GET",
                url: "http://phills2.gonetis.com:8000/interestItem/update/",
                params:{
                    id: params.data.id,
                    through_price: params.data.through_price,
                    leave_price: params.data.leave_price,
                    resist_price: params.data.resist_price,
                    support_price: params.newValue,
                    trend_high_price: params.data.trend_high_price,
                    trend_low_price: params.data.trend_low_price,
                    buy_expect_sum: params.data.buy_expect_sum
                }
                
                }).then(response => {
                    console.log("Success", response)
                }).catch(error => {
                    alert("처리 에러")
                    console.log("Failed to updateItem1", error.response);
                });
                return true;
            }, editable: true, cellEditor: 'agTextCellEditor', cellEditorParams: { min: 0, max: 9999999 }, valueFormatter: (params) => {return '￦' + params.value.toLocaleString();},},
            {headerName: '추세상단가격', field: 'trend_high_price', cellStyle: params=> {
                if(params.data.K_trend_high_price === '1' ) {
                    return {color:'red', 'font-weight': 'bold'}
                }
            }, valueSetter: params => {
                
                params.data.trend_high_price = params.newValue;

                axios({
                method: "GET",
                url: "http://phills2.gonetis.com:8000/interestItem/update/",
                params:{
                    id: params.data.id,
                    through_price: params.data.through_price,
                    leave_price: params.data.leave_price,
                    resist_price: params.data.resist_price,
                    support_price: params.data.support_price,
                    trend_high_price: params.newValue,
                    trend_low_price: params.data.trend_low_price,
                    buy_expect_sum: params.data.buy_expect_sum
                }
                
                }).then(response => {
                    console.log("Success", response)
                }).catch(error => {
                    alert("처리 에러")
                    console.log("Failed to updateItem1", error.response);
                });
                return true;
            }, editable: true, cellEditor: 'agTextCellEditor', cellEditorParams: { min: 0, max: 9999999 }, valueFormatter: (params) => {return '￦' + params.value.toLocaleString();},},
            {headerName: '추세하단가격', field: 'trend_low_price', cellStyle: params=> {
                if(params.data.D_trend_low_price === '1' ) {
                    return {color:'blue', 'font-weight': 'bold'}
                }
            }, valueSetter: params => {
                
                params.data.trend_low_price = params.newValue;

                axios({
                method: "GET",
                url: "http://phills2.gonetis.com:8000/interestItem/update/",
                params:{
                    id: params.data.id,
                    through_price: params.data.through_price,
                    leave_price: params.data.leave_price,
                    resist_price: params.data.resist_price,
                    support_price: params.data.support_price,
                    trend_high_price: params.data.trend_high_price,
                    trend_low_price: params.newValue,
                    buy_expect_sum: params.data.buy_expect_sum
                }
                
                }).then(response => {
                    console.log("Success", response)
                }).catch(error => {
                    alert("처리 에러")
                    console.log("Failed to updateItem1", error.response);
                });
                return true;
            }, editable: true, cellEditor: 'agTextCellEditor', cellEditorParams: { min: 0, max: 9999999 }, valueFormatter: (params) => {return '￦' + params.value.toLocaleString();},},
            {headerName: '매수예상금액', field: 'buy_expect_sum', valueSetter: params => {
                
                params.data.buy_expect_sum = params.newValue;

                axios({
                method: "GET",
                url: "http://phills2.gonetis.com:8000/interestItem/update/",
                params:{
                    id: params.data.id,
                    through_price: params.data.through_price,
                    leave_price: params.data.leave_price,
                    resist_price: params.data.resist_price,
                    support_price: params.data.support_price,
                    trend_high_price: params.data.trend_high_price,
                    trend_low_price: params.data.trend_low_price,
                    buy_expect_sum: params.newValue
                }
                
                }).then(response => {
                    console.log("Success", response)
                }).catch(error => {
                    alert("처리 에러")
                    console.log("Failed to updateItem1", error.response);
                });
                return true;
            }, editable: true, cellEditor: 'agTextCellEditor', cellEditorParams: { min: 0, max: 9999999 }, valueFormatter: (params) => {return '￦' + params.value.toLocaleString();},},
        ]);

        return {
            defaultColDef,
            colDefs
        }
        },
        data() {
            return {
                rowData: [],
                charturl: null,
                data: {
                    through_price: "",
                    leave_price: "",
                    resist_price: "",
                    support_price: "",
                    trend_high_price: "",
                    trend_low_price: "",
                    buy_expect_sum: ""
                },
            };
        },
        methods : {
            onCellClicked: (e) =>{
                let charturl = null;
                
                if(e.column.colId === 'code'){
                    if(e.data.code === '0001' || e.data.code === '1001'){
                        axios({
                            method: "GET",
                            url: "http://phills2.gonetis.com:8000/stockBalance/marketInfo/",
                            params:{
                                market: e.data.code.trim() === '0001' ? '1001' : '2001'
                            }
                                
                        }).then(response => {
                            console.log("Success", response)
                            charturl = "http://phills2.gonetis.com:8000/stockBalance/"+response.data[0].market+"/"
                            window.open(charturl, "", "_blank"); 
                            charturl = null
                        }).catch(error => {
                            alert("처리 에러")
                            console.log("Failed to kospiInfo", error.response);
                        }); 
                        if(charturl != null) 
                            window.open(charturl, "", "_blank");
                    }else{
                        axios({
                            method: "GET",
                            url: "http://phills2.gonetis.com:8000/stockOrder/chart/",
                            params:{
                                code: e.data.code.trim(),
                                company: e.data.name.trim(),
                            }
                                                
                        }).then(response => {
                            console.log("Success", response)
                            charturl = "http://phills2.gonetis.com:8000/stockOrder/"+response.data[0].name+"/"
                            window.open(charturl, "", "_blank"); 
                            charturl = null
                        }).catch(error => {
                            alert("처리 에러")
                            console.log("Failed to doInfo", error.response);
                        }); 
                        if(charturl != null) 
                            window.open(charturl, "", "_blank"); 
                    }    
                }
                if(e.column.colId === 'name'){  
                    if(e.data.code === '0001' || e.data.code === '1001'){
                        axios({
                        method: "GET",
                        url: "http://phills2.gonetis.com:8000/stockBalance/marketMinutesInfo/",
                        params:{
                            market: e.data.code.trim(),
                            app_key: e.data.app_key,
                            app_secret: e.data.app_secret,
                            access_token: e.data.access_token
                        }
                                    
                        }).then(response => {
                            console.log("Success", response)
                            charturl = "http://phills2.gonetis.com:8000/stockBalance/minutes_"+response.data[0].market+"/"
                            window.open(charturl, "", "_blank"); 
                            charturl = null
                        }).catch(error => {
                            alert("처리 에러")
                            console.log("Failed to kospiMinutesInfo", error.response);
                        }); 
                        if(charturl != null) 
                            window.open(charturl, "", "_blank");

                    }else{
                        axios({
                            method: "GET",
                            url: "http://phills2.gonetis.com:8000/stockOrder/minutesInfo/",
                            params:{
                                code: e.data.code.trim(),
                                company: e.data.name.trim(),
                                app_key: e.data.app_key,
                                app_secret: e.data.app_secret,
                                access_token: e.data.access_token
                            }
                                    
                        }).then(response => {
                            console.log("Success", response)
                            charturl = "http://phills2.gonetis.com:8000/stockOrder/minutes_"+response.data[0].name+"/"
                            window.open(charturl, "", "_blank"); 
                            charturl = null
                        }).catch(error => {
                            alert("처리 에러")
                            console.log("Failed to minutesInfo", error.response);
                        }); 
                        if(charturl != null) 
                            window.open(charturl, "", "_blank"); 
                    }
                }
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
                    this.rowData = response.data;
                    this.rowData.forEach(data => {data.acct_no = this.$route.params.acct_no})
                    this.rowData.forEach(data => {data.app_key = this.$route.params.app_key})
                    this.rowData.forEach(data => {data.app_secret = this.$route.params.app_secret})
                    this.rowData.forEach(data => {data.access_token = this.$route.params.access_token})
                }).catch(error => {
                    alert("처리 에러")
                    console.log("Failed to fetchData", error.response);
                });
            },    
            runDelete: function(){
                this.rowData.forEach(data =>{
                    if(data.chk){
                        axios({
                            method: "DELETE",
                            url: "http://phills2.gonetis.com:8000/kis/interestItem/" + data.id + "/", // http://phills2.gonetis.com:8000/kis/interestItem/1 로 delete 이벤트 전송
                        }).then((response) => {
                            console.log("Success", response);
                            this.fetchData()
                        }).catch((error) => {
                        console.log("Failed to deleteItem", error.response);
                        });
                    } 
                })

            },
        },
        created() { 
            this.fetchData();
        }
    });
</script>
<style scoped>
.up1 {
    font-weight: bold;
    color: red;
}
.up2 {
    font-weight: bold;
    color: darkred;
}
.up3 {
    font-weight: bold;
    color: mediumvioletred
}
.down1 {
  font-weight: bold;
  color: blue;
}
.down2 {
  font-weight: bold;
  color: darkblue;
}
.down3 {
  font-weight: bold;
  color: mediumturquoise;
}
</style>    
  
    
    
    