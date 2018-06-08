import { graphene } from '~/components/graphene'

export const store = () => ({
  assets: {}
})

export const mutations = {
  ADD_ASSET_INFO: function (state, {asset}) {
    asset.rate = Math.pow(10, asset.precision)
    state.assets[asset.id] = asset
    console.log('$$$$$ ADD_ASSET_INFO', asset)
  }
}

export const actions = {
  async query_asset_rate ({state, commit}, {assetid}) {
    if (state.rates[assetid]) {
      return state.rates[assetid].rate
    } else {
      const asset = await graphene.queryObject({assetid})
      commit('ADD_ASSET_INFO', {asset})
    }
  }
}