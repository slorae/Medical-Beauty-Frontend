import Taro , { Component } from '@tarojs/taro';
import { View, Navigator} from '@tarojs/components';
import { AtTag, AtTabs, AtTabsPane } from 'taro-ui';
import { groupOnMy} from '../../../services/group';
import {Empty} from '../../../components';

import './index.less';

const tabList = [
  { title: '发起的团购' },
  { title: '参加的团购' }
]

class Index extends Component {

   config = {
       navigationBarTitleText: '我的团购'
  }

  state={
    orderList: [],
    showType: 0
  }

  componentWillMount () {}
  componentDidMount () {}
  componentWillReceiveProps (nextProps,nextContext) {}
  componentWillUnmount () {}
  componentDidShow () {}
  componentDidHide () {}
  componentDidCatchError () {}
  componentDidNotFound () {}


  onPullDownRefresh() {
    Taro.showNavigationBarLoading() //在标题栏中显示加载
    this.getOrderList();
    Taro.hideNavigationBarLoading() //完成停止加载
    Taro.stopPullDownRefresh() //停止下拉刷新
  }

  getOrderList = () => {
    groupOnMy({
      showType: this.state.showType
    }).then(res => {
      this.setState({
        orderList: res.list
      });
    })
  }

  switchTab = (tab) => {
    let showType = tab;
    this.setState({
      showType: showType
    }, () => {
      this.getOrderList();
    });

  }

  render() {
    const { showType, orderList } = this.state;
    return (
      <View className='container'>
        <AtTabs current={showType} tabList={tabList} onClick={this.switchTab}>

          {tabList.map((tab, index) => {
            return <AtTabsPane key={tab.title} current={showType} index={index} >
              {
                orderList.length <= 0 && <Empty>尚未参加任何团购</Empty>
              }
              <View className='orders'>
                {
                  orderList.map(item => {
                    return <Navigator url={`../grouponDetail/grouponDetail?id=${item.id}`} className='order' openType='navigate' key={item.id}>
                      <View className='h'>
                        {item.groupon.status === 1 && <AtTag type='primary' circle>开团中</AtTag>}
                        {item.groupon.status === 2 && <AtTag type='primary' circle>开团成功</AtTag>}
                        {item.groupon.status === 3 && <AtTag type='primary' circle>开团失败</AtTag>}
                        {!item.isCreator && <AtTag type='primary' circle>发起</AtTag>}
                      </View>
                      <View className='h'>
                        <View className='l'>订单编号：{item.orderSn}</View>
                        <View className='r'>{item.orderStatusText}</View>
                      </View>
                      <View className='j'>
                        <View className='l'>团购立减：￥{item.rules.discount}</View>
                        <View className='r'>参与时间：{item.groupon.addTime}</View>
                      </View>
                      <View className='i'>
                        <View className='l'>团购要求：{item.rules.discountMember}人</View>
                        <View className='r'>当前参团：{item.joinerCount}人</View>
                      </View>
                      {
                        item.goodsList.map(gitem => {
                          return <View className='goods' key={gitem.id}>
                            <View className='img'>
                              <image src='{{gitem.picUrl}}'></image>
                            </View>
                            <View className='info'>
                              <text className='name'>{gitem.goodsName}</text>
                              <text className='number'>共{gitem.number}件商品</text>
                            </View>
                            <View className='status'></View>
                          </View>
                        })
                      }

                      <View className='b'>
                        <View className='l'>实付：￥{item.actualPrice}</View>
                      </View>
                    </Navigator>
                  })
                }
              </View>
            </AtTabsPane>
          })}
        </AtTabs>

      </View>
    );
  }
}
export default Index;
