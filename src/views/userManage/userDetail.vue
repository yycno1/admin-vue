<template>
  <div v-loading="loading">
    <el-card>
      <div slot="header">公积金信息</div>
      <div v-if="!isEmptyObj(fundsAccount)">
        <el-row>
          <el-col class="item-unit" :span="4">姓名</el-col>
          <el-col class="item-unit" :span="8">{{fundsAccount.customer_name}}</el-col>
          <el-col class="item-unit" :span="4">身份证号</el-col>
          <el-col class="item-unit" :span="8">{{fundsAccount.customer_idcard}}</el-col>
        </el-row>
        <el-row>
          <el-col class="item-unit" :span="4">账户余额</el-col>
          <el-col class="item-unit" :span="8">{{fundsAccount.customer_balance}}元</el-col>
          <el-col class="item-unit" :span="4">最近缴存日期</el-col>
          <el-col class="item-unit" :span="8">{{fundsAccount.customer_time | formatTime('yyyy-MM-dd hh:mm:ss')}}</el-col>
        </el-row>
        <el-row>
          <el-col class="item-unit" :span="4">月缴存金额</el-col>
          <el-col class="item-unit" :span="8">{{fundsAccount.customer_deposit_amount}}元</el-col>
          <el-col class="item-unit" :span="4">月缴存基数</el-col>
          <el-col class="item-unit" :span="8">{{fundsAccount.customer_deposit_base}}元</el-col>
        </el-row>
        <el-row>
          <el-col class="item-unit" :span="4">公司缴存比例</el-col>
          <el-col class="item-unit" :span="8">{{fundsAccount.customer_company_rate}}%</el-col>
          <el-col class="item-unit" :span="4">个人缴存比例</el-col>
          <el-col class="item-unit" :span="8">{{fundsAccount.customer_person_rate}}%</el-col>
        </el-row>
        <el-row>
          <el-col class="item-unit" :span="4">缴存状态</el-col>
          <el-col class="item-unit" :span="8">{{fundsAccount.customer_status}}</el-col>
          <el-col class="item-unit" :span="4">缴存公司名称</el-col>
          <el-col class="item-unit" :span="8">{{fundsAccount.customer_company}}</el-col>
        </el-row>
      </div>
      <div v-else>
        <p class="no-data-placeholder">暂无数据</p>
      </div>
    </el-card>

    <el-card>
      <div slot="header">贷款信息</div>
      <div v-if="!isEmptyObj(fundsLoan)">
        <el-row>
          <el-col class="item-unit" :span="4">贷款额度</el-col>
          <el-col class="item-unit" :span="8">{{fundsLoan.loan_limit}}元</el-col>
          <el-col class="item-unit" :span="4">贷款余额</el-col>
          <el-col class="item-unit" :span="8">{{fundsLoan.loan_balance}}元</el-col>
        </el-row>
        <el-row>
          <el-col class="item-unit" :span="4">贷款期限</el-col>
          <el-col class="item-unit" :span="8">{{fundsLoan.loan_period}}个月</el-col>
          <el-col class="item-unit" :span="4">还款方式</el-col>
          <el-col class="item-unit" :span="8">{{fundsLoan.loan_refund}}</el-col>
        </el-row>
        <el-row>
          <el-col class="item-unit" :span="4">贷款利率</el-col>
          <el-col class="item-unit" :span="8">{{fundsLoan.loan_loan_rate}}%</el-col>
          <el-col class="item-unit" :span="4">贷款罚息利率</el-col>
          <el-col class="item-unit" :span="8">{{fundsLoan.loan_penalty_rate}}%</el-col>
        </el-row>
        <el-row>
          <el-col class="item-unit" :span="4">贷款发放日期</el-col>
          <el-col class="item-unit" :span="8">{{fundsLoan.loan_begin_date}}</el-col>
          <el-col class="item-unit" :span="4">贷款结束日期</el-col>
          <el-col class="item-unit" :span="8">{{fundsLoan.loan_end_date}}</el-col>
        </el-row>
      </div>
      <div v-else>
        <p class="no-data-placeholder">暂无数据</p>
      </div>
    </el-card>

    <el-card>
      <div slot="header">公积金流水</div>
      <el-table :data="fundsFlowList" border>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="流水日期" prop="flow_record_date"></el-table-column>
        <el-table-column label="流水月份" prop="flow_record_month"></el-table-column>
        <el-table-column label="流水缴存金额(元)" prop="flow_amount"></el-table-column>
        <el-table-column label="账户金额(元)" prop="flow_balance"></el-table-column>
      </el-table>
      <el-pagination
        v-show="flowListPageTotal > 0"
        class="form-pagination"
        @size-change="handleFlowListSizeChange"
        @current-change="handleFlowListCurrentChange"
        :page-size="flowListPageData.pageSize"
        :page-sizes="[5, 10, 15, 20, 25, 30]"
        :currentPage="flowListPageData.pageNum"
        :total="flowListPageTotal"
        layout="total,sizes,prev,pager,next,jumper">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { fetchFundsAccount, fetchFundsLoan, fetchFundsFlowList } from 'common/api';

export default{
  name: 'userDetail',

  data() {
    return {
      fundsAccount: {},
      fundsLoan: {},
      fundsFlowList: [],
      credit_flow: '',
      type: '',

      flowListPageData: {
        pageSize: 10,
        pageNum: 1,
      },
      flowListPageTotal: 0,
      loading: false,
    };
  },
  methods: {
    getFundsData() {
      this.loading = true;
      Promise.all([this.getFundsAccount(), this.getFundsLoan(), this.getFundsFlowList()])
        .then(() => {
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getFundsAccount() {
      return fetchFundsAccount({ credit_flow: this.credit_flow })
        .then(({ body }) => {
          if (body.responseStatus === '0') {
            this.fundsAccount = body.object || {};
          }
        });
    },
    getFundsLoan() {
      return fetchFundsLoan({ credit_flow: this.credit_flow })
        .then(({ body }) => {
          if (body.responseStatus === '0') {
            this.fundsLoan = body.object || {};
          }
        });
    },
    getFundsFlowList() {
      const params = {
        credit_flow: this.credit_flow,
        ...this.flowListPageData,
      };

      return fetchFundsFlowList(params)
        .then(({ body }) => {
          if (body.responseStatus === '0') {
            this.flowListPageTotal = body.object.total;
            this.fundsFlowList = body.object.list || [];
          }
        });
    },
    handleFlowListSizeChange(size) {
      this.flowListPageData.pageSize = size;
      this.getFundsFlowList();
    },
    handleFlowListCurrentChange(num) {
      this.flowListPageData.pageNum = num;
      this.getFundsFlowList();
    },
    isEmptyObj(obj) {
      return Object.keys(obj).length === 0;
    },
  },
  created() {
    const query = this.$route.query;
    this.credit_flow = query.credit_flow;
    this.getFundsData();
  },
};
</script>

<style lang="scss" scoped>
.item-unit{
  height: 44px;
  line-height: 44px;
  text-align: center;
  border: 1px solid #666;
  margin-top: -1px;
  margin-left: -1px;
}
.item-unit:nth-of-type(2n-1){
  background: #aaa;
  font-weight: bold;
}
.form-pagination{
  margin-bottom: 10px;
}
</style>
