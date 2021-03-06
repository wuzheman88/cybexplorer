<template>
  <div ref="main" style="width: 100%;height:300px;" id="main-chart"></div>
</template>

<script>
import echarts from 'echarts'
import { graphene } from '~/components/graphene'
import moment from 'moment'
moment.locale('zh-cn')

export default {
  props: {
    data: {
      required: true,
      type: Object
    }
  },
  async mounted () {
    var myChart = echarts.init(this.$refs.main)
    // 指定图表的配置项和数据
    var upColor = '#ec0000'
    var upBorderColor = '#8A0000'
    var downColor = '#00da3c'
    var downBorderColor = '#008F28'
    const end = this.end || Date.now()
    const start = this.start || end - 3600 * 1000 * 24 * 7
    const marketHistory = await graphene.queryMarketHistory(this.data.base, this.data.quote, new Date(start), new Date(end), function(x){console.log('subscribe', x)})
    const datas = []

    // const baseAsset = await this.$store.dispatch('api/query_asset', {assetid: this.data.base})
    // const quoteAsset = await this.$store.dispatch('api/query_asset', {assetid: this.data.quote})
    const baseAsset = await graphene.queryObject(this.data.base)
    const quoteAsset = await graphene.queryObject(this.data.quote)
    baseAsset.rate = Math.pow(10, baseAsset[0].precision)
    quoteAsset.rate = Math.pow(10, quoteAsset[0].precision)

    marketHistory.prices.forEach((price) => {
      const openPrice = (price.open_base / baseAsset.rate) / (price.open_quote / quoteAsset.rate)
      const closePrice = (price.close_base / baseAsset.rate) / (price.close_quote / quoteAsset.rate)
      const lowPrice = (price.low_base / baseAsset.rate) / (price.low_quote / quoteAsset.rate)
      const highPrice = (price.high_base / baseAsset.rate) / (price.high_quote / quoteAsset.rate)
      datas.push([price.key.open, openPrice, closePrice, lowPrice, highPrice])
    })

    // 数据意义：开盘(open)，收盘(close)，最低(lowest)，最高(highest)
    var data0 = splitData(datas)
    function splitData(rawData) {
      var categoryData = []
      var values = []
      for (var i = 0; i < rawData.length; i++) {
        const cat = rawData[i].splice(0, 1)[0]
        categoryData.push(cat)
        values.push(rawData[i])                      
      }
      return {
        categoryData: categoryData,
        values: values
      }
    }

    const seriesList = [
    {
      name: '日K',
      type: 'candlestick',
      data: data0.values,
      itemStyle: {
        normal: {
          color: upColor,
          color0: downColor,
          borderColor: upBorderColor,
          borderColor0: downBorderColor
        }
      },
      markPoint: {
        label: {
          normal: {
            formatter: function (param) {
              return param != null ? Math.round(param.value) : ''
            }
          }
        },
        data: [
            {
              name: 'XX标点',
              coord: ['2013/5/31', 2300],
              value: 2300,
              itemStyle: {
                normal: {color: 'rgb(41,60,85)'}
              }
            }
            // {
            //   name: 'highest value',
            //   type: 'max',
            //   valueDim: 'highest'
            // },
            // {
            //   name: 'lowest value',
            //   type: 'min',
            //   valueDim: 'lowest'
            // },
            // {
            //   name: 'average value on close',
            //   type: 'average',
            //   valueDim: 'close'
            // }
          ],
          tooltip: {
            formatter: function (param) {
              return param.name + '<br>' + (param.data.coord || '')
            }
          }
        },
        markLine: {
          symbol: ['none', 'none'],
          data: [
            [
              {
                name: 'from lowest to highest',
                type: 'min',
                valueDim: 'lowest',
                symbol: 'circle',
                symbolSize: 10,
                label: {
                    normal: {show: false},
                    emphasis: {show: false}
                }
              },
              {
                type: 'max',
                valueDim: 'highest',
                symbol: 'circle',
                symbolSize: 10,
                label: {
                  normal: {show: false},
                  emphasis: {show: false}
                }
              }
            ],
            {
              name: 'min line on close',
              type: 'min',
              valueDim: 'close'
            },
            {
              name: 'max line on close',
              type: 'max',
              valueDim: 'close'
            }
          ]
        }
      }
    ]
    if (!this.data.snapshot) {
      // seriesList.push({
      //   name: 'MA5',
      //   type: 'line',
      //   data: calculateMA(5),
      //   smooth: true,
      //   lineStyle: {
      //     normal: {opacity: 0.5}
      //   }
      // })
      seriesList.push({
        name: 'MA7',
        type: 'line',
        data: calculateMA(7),
        smooth: true,
        lineStyle: {
          normal: {opacity: 0.5}
        }
      })
      // seriesList.push({
      //   name: 'MA20',
      //   type: 'line',
      //   data: calculateMA(20),
      //   smooth: true,
      //   lineStyle: {
      //     normal: {opacity: 0.5}
      //   }
      // })
      // seriesList.push({
      //   name: 'MA30',
      //   type: 'line',
      //   data: calculateMA(30),
      //   smooth: true,
      //   lineStyle: {
      //     normal: {opacity: 0.5}
      //   }
      // })
    }

    function calculateMA(dayCount) {
      var result = []
      for (var i = 0, len = data0.values.length; i < len; i++) {
        if (i < dayCount) {
            result.push('-')
            continue
        }
        var sum = 0
        for (var j = 0; j < dayCount; j++) {
            sum += data0.values[i - j][1]
        }
        result.push(sum / dayCount)
      }
      return result
    }
    
    const option = {
      title: {
        text: '成交行情',
        left: 0
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        data: ['日K', 'MA5', 'MA7', 'MA20', 'MA30']
      },
      grid: {
        left: '10%',
        right: '10%',
        bottom: '15%'
      },
      xAxis: {
        type: 'category',
        data: data0.categoryData,
        scale: true,
        boundaryGap : false,
        axisLine: {onZero: false},
        splitLine: {show: false},
        splitNumber: 20,
        min: 'dataMin',
        max: 'dataMax'
      },
      yAxis: {
        scale: true,
        splitArea: {
          show: true
        }
      },
      dataZoom: [
        {
          type: 'inside',
          start: 50,
          end: 100
        },
        {
          show: true,
          type: 'slider',
          y: '90%',
          start: 50,
          end: 100
        }
      ],
      series: seriesList
      }
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option)
  }
}
</script>
