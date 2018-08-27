<template>
  <div>
    <div v-if="optype===optypes.fill_order">
      <object-link :objectid="opdata.account_id"></object-link>卖出了{{opdata.pays.amount}}
      <object-link :objectid="opdata.pays.asset_id"></object-link>获得了{{opdata.receives.amount}}
      <object-link :objectid="opdata.receives.asset_id"></object-link>
    </div>
    <div v-if="optype===optypes.limit_order_create">
      <object-link :objectid="opdata.seller"></object-link>提交卖单，希望卖出{{opdata.amount_to_sell.amount}}
      <object-link :objectid="opdata.amount_to_sell.asset_id"></object-link>, 最少换取{{opdata.min_to_receive.amount}}
      <object-link :objectid="opdata.min_to_receive.asset_id"></object-link>
      <!-- , 卖出价格为：{{}} / {{}} -->
    </div>
  </div>
</template>

<script>
import ObjectLink from '~/components/ObjectLink.vue'

export default {
  props: {
    operation: {
      required: true,
      type: Object
    }
  },
  components: {
    ObjectLink
  },
  data () {
    return {
      optype: null,
      opdata: {},
      optypes: {
        transfer: 0,
        limit_order_create: 1,
        limit_order_cancel: 2,
        call_order_update: 3,
        fill_order: 4,
        account_create: 5,
        account_update: 6,
        account_whitelist: 7,
        account_upgrade: 8,
        account_transfer: 9,
        asset_create: 10,
        asset_update: 11,
        asset_update_bitasset: 12,
        asset_update_feed_producers: 13,
        asset_issue: 14,
        asset_reserve: 15,
        asset_fund_fee_pool: 16,
        asset_settle: 17,
        asset_global_settle: 18,
        asset_publish_feed: 19,
        witness_create: 20,
        witness_update: 21,
        proposal_create: 22,
        proposal_update: 23,
        proposal_delete: 24,
        withdraw_permission_create: 25,
        withdraw_permission_update: 26,
        withdraw_permission_claim: 27,
        withdraw_permission_delete: 28,
        committee_member_create: 29,
        committee_member_update: 30,
        committee_member_update_global_parameters: 31,
        vesting_balance_create: 32,
        vesting_balance_withdraw: 33,
        worker_create: 34,
        custom: 35,
        assert: 36,
        balance_claim: 37,
        override_transfer: 38,
        transfer_to_blind: 39,
        blind_transfer: 40,
        transfer_from_blind: 41,
        asset_settle_cancel: 42,
        asset_claim_fees: 43,
        asset_settle_cancel_demo: 44,    
        initiate_crowdfund: 45,
        participate_crowdfund: 46,
        withdraw_crowdfund: 47,
      }
    }
  },
  mounted () {
    this.optype = this.operation.op[0]
    this.opdata = this.operation.op[1]
  }
}
</script>