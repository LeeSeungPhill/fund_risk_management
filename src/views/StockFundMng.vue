<template>
  <div>
    <v-container fluid>
      <v-row>
        <v-col align="center">
          <v-subheader>
            [자산 관리]
          </v-subheader>
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

let url = "http://phills2.gonetis.com:8000/stockFundMng/list/"; //장고 서버 주소

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
      {headerName: '자산번호', field: 'asset_num'},
      {headerName: '승률', field: 'market_ratio', valueFormatter: (params) => {return  params.value.toLocaleString() + '%';},},
      {headerName: '현금비중', field: 'cash_rate',valueFormatter: (params) => {return  params.value.toLocaleString() + '%';},},
      {headerName: '현금비중액', field: 'cash_rate_amt', valueFormatter: (params) => {return '￦' + params.value.toLocaleString();},},
      {headerName: '총평가금액', field: 'tot_evlu_amt', valueFormatter: (params) => {return '￦' + params.value.toLocaleString();},},
      {headerName: '잔고금액', field: 'scts_evlu_amt', valueFormatter: (params) => {return '￦' + params.value.toLocaleString();},},
      {headerName: '총예수금', field: 'dnca_tot_amt', valueFormatter: (params) => {return '￦' + params.value.toLocaleString();},},
      {headerName: '가정산금', field: 'prvs_rcdl_excc_amt', valueFormatter: (params) => {return '￦' + params.value.toLocaleString();},},
      {headerName: '전일비증감', field: 'asset_icdc_amt', valueFormatter: (params) => {return '￦' + params.value.toLocaleString();},},
      {headerName: '순자산금', field: 'nass_amt', valueFormatter: (params) => {return '￦' + params.value.toLocaleString();},},
      {headerName: '매도예정', field: 'sell_plan_amt', valueFormatter: (params) => {return '￦' + params.value.toLocaleString();},},
      {headerName: '매수예정', field: 'buy_plan_amt', valueFormatter: (params) => {return '￦' + params.value.toLocaleString();},},
    ]);

    return {
      defaultColDef,
      colDefs
    }
  },
  data() {
    return {
      rowData: []
    }
  },
  methods: {
    formatDate(str){
      return str.split('T')[0];
    },
    fetchData(){
      axios({
      method: "GET",
      url: url,
      params: {
        acct_no: this.$route.params.acct_no,
        app_key: this.$route.params.app_key,
        app_secret: this.$route.params.app_secret,
        access_token: this.$route.params.access_token
      }
    })
    .then(response => {
      console.log('fundMng:', response.data)
      this.rowData = response.data;
    })
    .catch(error => {
      console.log(error)
    })
    }
  },
  created() { 
    this.fetchData();
  }

   
});
</script>