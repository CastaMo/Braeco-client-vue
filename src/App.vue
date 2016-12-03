<template>
  <div id="app">
      <div id="popout">
          <tips></tips>
      </div>
      <div id="main">
          <div id="mainbar">
              <transition :name="transitionName" mode="out-in">
                  <router-view></router-view>
              </transition>
              <footer-bar></footer-bar>
              <trolley-footer-bar
                  :order-final-price="totalFinalPrice"
                  :order-total-number="orderTotalNumber"
              ></trolley-footer-bar>
          </div>
      </div>
  </div>
</template>
