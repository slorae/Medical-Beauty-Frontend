import Taro , { Component } from '@tarojs/taro';
import { View, Text , Image, ScrollView, Input} from '@tarojs/components';
import { AtIcon, AtTabs, AtTabsPane  } from 'taro-ui';

import { getCouponMyList, couponExchange } from '../../../services/coupon';
import {showErrorToast} from '../../../utils/util';
import {Empty} from '../../../components';

import './index.less';

class Index extends Component {

   config = {
    "enablePullDownRefresh": true,
    "navigationBarTitleText": "我的优惠券"
  }

  state={
    couponList: [],
    code: '',
    status: 0,
    page: 1,
    limit: 10,
    count: 0,
    scrollTop: 0,
    showPage: false
  }

  componentDidMount () {
    this.getCouponList();
  }

  onPullDownRefresh() {
    Taro.showNavigationBarLoading() //在标题栏中显示加载
    this.getCouponList();
    Taro.hideNavigationBarLoading() //完成停止加载
    Taro.stopPullDownRefresh() //停止下拉刷新
  }

  getCouponList = () => {
    this.setState({
      scrollTop: 0,
      showPage: false,
      couponList: []
    }, () => {
      getCouponMyList({
        status: this.state.status,
        page: this.state.page,
        limit: this.state.limit
      }).then(res => {
        this.setState({
          scrollTop: 0,
          couponList: res.list,
          showPage: res.total > this.limit,
          count: res.total
        });
      })
    });


  }

  switchTab = (tab) => {
    this.setState({
      couponList: [],
      status: tab,
      page: 1,
      limit: 10,
      count: 0,
      scrollTop: 0,
      showPage: false
    }, () => {
      this.getCouponList();
    });


  }

  bindExchange = (e) => {
    this.setState({
      code: e.detail.value
    });
  }

  goExchange = () => {
    if (this.state.code.length === 0) {
      showErrorToast("请输入兑换码");
      return;
    }

    couponExchange({
      code: this.state.code
    }).then(res => {
      this.getCouponList();
      this.clearExchange();
      Taro.showToast({
        title: "领取成功",
        duration: 2000
      })
    })

  }

  clearExchange = () => {
    this.setState({
      code: ''
    });
  }

  prevPage = () => {
    if (this.state.page <= 1) {
      return false;
    }

    this.setState({
      page: this.state.page - 1
    }, () => {
      this.getCouponList();
    });

  }

  nextPag = () => {
    if (this.state.page > this.state.count / this.state.limit) {
      return true;
    }

    this.setState({
      page: this.state.page + 1
    }, () => {
      this.getCouponList();
    });

  }

  render() {
    const { status, code, showPage, page, couponList, count, size, scrollTop } = this.state;
    const tabList = [
      { title: '未使用' },
      { title: '已使用' },
      { title: '已过期' }
    ]
    return (
      <View className='container'>
        <AtTabs current={status} tabList={tabList} onClick={this.switchTab}>
          {tabList.map((tab, index) => {
            return <AtTabsPane key={tab.title} current={status} index={index} >
              <View className='b'>
                {
                  status == 0 && <View className='coupon-form'>
                    <View className='input-box'>
                      <Input className='coupon-sn' placeholder='请输入优惠码' value={code} onInput={this.bindExchange} />
                      {
                        code.length > 0 && <View className='clear-icon'><AtIcon value='close-circle' size='14' color='#666' onClick={this.clearExchange} /></View>
                      }
                    </View>
                    <View className='add-btn' onClick={this.goExchange}>兑换</View>
                  </View>
                }
                {
                  couponList.length === 0 && <Empty>暂无优惠券</Empty>
                }
                {
                  status == 0 && <View className='help'>
                    {/* <AtIcon value='help' size='16' color='#666' /> */}
                    使用说明
                  </View>
                }
                <ScrollView className='coupon-list' scrollY scrollTop={scrollTop}>

                  {
                    Array.isArray(couponList) && couponList.map((item) => {
                      return <View className={`item ${ status == 0 ? 'active' : ''}`} key={item.id}>
                        <View className='tag'>{item.tag}</View>
                        <View className='content'>
                          <View className='left'>
                            <View className='discount'>{item.discount}元</View>
                            <View className='min'> 满{item.min}元使用</View>
                          </View>
                          <View className='right'>
                            <View className='name'>{item.name}</View>
                            <View className='time'> 有效期：{item.startTime} - {item.endTime}</View>
                          </View>
                        </View>
                        <View className='condition'>
                          <Text className='txt'>{item.desc}</Text>
                          <Image src={item.pic} className='icon'></Image>
                        </View>
                      </View>
                    })
                  }

                  {
                    showPage && <View className='page'>
                      <View className={`prev ${ page <= 1 ? 'disabled' : ''}`} onClick={this.prevPage}>上一页</View>
                      <View className={`next ${ (count / size) < page ? 'disabled' : ''}`} onClick={this.nextPage}>下一页</View>
                    </View>
                  }

                </ScrollView>
              </View>
            </AtTabsPane>
          })}
        </AtTabs>
      </View>
    );
  }
}
export default Index;
