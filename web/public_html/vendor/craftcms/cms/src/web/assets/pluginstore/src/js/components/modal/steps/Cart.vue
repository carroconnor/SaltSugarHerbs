<template>
  <step>
    <template slot="header">
      <h1>{{ 'Cart' | t('app') }}</h1>
    </template>

    <template slot="main">
      <template v-if="!activeTrialsLoading">
        <h2>{{ 'Items in your cart' | t('app') }}</h2>

        <template v-if="cart">
          <template v-if="cartItems.length">
            <table class="cart-data fullwidth">
              <thead>
                <tr>
                  <th></th>
                  <th>{{ 'Item' | t('app') }}</th>
                  <th>{{ 'Updates' | t('app') }}</th>
                  <th class="w-10"></th>
                </tr>
              </thead>
              <tbody
                v-for="(item, itemKey) in cartItems"
                :key="'item' + itemKey"
              >
                <tr class="item-details">
                  <template
                    v-if="item.lineItem.purchasable.type === 'cms-edition'"
                  >
                    <td class="thin">
                      <div class="plugin-icon">
                        <img :src="craftLogo" width="40" height="40" />
                      </div>
                    </td>
                    <td class="item-name">
                      <strong>Craft CMS</strong>
                      <edition-badge
                        :name="item.lineItem.purchasable.name"
                      ></edition-badge>
                    </td>
                  </template>

                  <template
                    v-else-if="
                      item.lineItem.purchasable.type === 'plugin-edition'
                    "
                  >
                    <td class="thin">
                      <div class="plugin-icon">
                        <img
                          v-if="item.plugin.iconUrl"
                          :src="item.plugin.iconUrl"
                          width="40"
                          height="40"
                        />
                      </div>
                    </td>
                    <td>
                      <div class="item-name">
                        <strong>{{ item.plugin.name }}</strong>
                        <edition-badge
                          v-if="item.plugin.editions > 1"
                          :name="item.lineItem.purchasable.name"
                        ></edition-badge>
                      </div>
                    </td>
                  </template>

                  <td class="expiry-date">
                    <template
                      v-if="
                        item.lineItem.purchasable.type === 'cms-edition' ||
                        (item.lineItem.purchasable.type === 'plugin-edition' &&
                          (item.lineItem.options.licenseKey.substr(0, 4) ===
                            'new:' ||
                            (pluginLicenseInfo(item.plugin.handle) &&
                              pluginLicenseInfo(item.plugin.handle).isTrial)))
                      "
                    >
                      <dropdown
                        v-model="selectedExpiryDates[itemKey]"
                        :options="itemExpiryDateOptions(itemKey)"
                        @input="onSelectedExpiryDateChange(itemKey)"
                      />
                    </template>

                    <spinner v-if="itemLoading(itemKey)"></spinner>
                  </td>
                  <td class="price">
                    <strong>{{ item.lineItem.price | currency }}</strong>
                  </td>
                </tr>

                <template
                  v-for="(adjustment, adjustmentKey) in item.lineItem
                    .adjustments"
                >
                  <tr
                    :key="itemKey + 'adjustment-' + adjustmentKey"
                    class="sub-item"
                  >
                    <td class="blank-cell"></td>
                    <td class="blank-cell"></td>
                    <td>
                      <template
                        v-if="
                          adjustment.sourceSnapshot.type === 'extendedUpdates'
                        "
                      >
                        {{
                          'Updates until {date}'
                            | t('app', {
                              date: $options.filters.formatDate(
                                adjustment.sourceSnapshot.expiryDate
                              ),
                            })
                        }}
                      </template>
                      <template v-else>
                        {{ adjustment.name }}
                      </template>
                    </td>
                    <td class="price">
                      {{ adjustment.amount | currency }}
                    </td>
                  </tr>
                </template>

                <tr class="sub-item">
                  <td class="blank-cell"></td>
                  <td class="blank-cell"></td>
                  <td class="empty-cell"></td>
                  <td class="price">
                    <div class="w-16">
                      <template v-if="!removeFromCartLoading(itemKey)">
                        <a role="button" @click="removeFromCart(itemKey)">{{
                          'Remove' | t('app')
                        }}</a>
                      </template>
                      <template v-else>
                        <spinner class="sm"></spinner>
                      </template>
                    </div>
                  </td>
                </tr>
              </tbody>

              <tbody>
                <tr>
                  <th class="total-price" colspan="3">
                    <strong>{{ 'Total Price' | t('app') }}</strong>
                  </th>
                  <td class="total-price">
                    <strong>{{ cart.totalPrice | currency }}</strong>
                  </td>
                </tr>
              </tbody>
            </table>

            <div class="py-4 flex">
              <btn
                kind="primary"
                @click="payment()"
                :loading="loadingCheckout"
                >{{ 'Checkout' | t('app') }}</btn
              >
            </div>
          </template>

          <div v-else>
            <p>
              {{ 'Your cart is empty.' | t('app') }}
              <a @click="$emit('continue-shopping')">{{
                'Continue shopping' | t('app')
              }}</a>
            </p>
          </div>
        </template>

        <active-trials></active-trials>
      </template>
      <template v-else>
        <spinner></spinner>
      </template>
    </template>
  </step>
</template>

<script>
  /* global Craft */

  import {mapState, mapGetters, mapActions} from 'vuex';
  import Step from '../Step';
  import EditionBadge from '../../EditionBadge';
  import ActiveTrials from './cart/ActiveTrials';

  export default {
    data() {
      return {
        activeTrialsLoading: true,
        loadingItems: {},
        loadingRemoveFromCart: {},
        loadingCheckout: false,
      };
    },

    components: {
      ActiveTrials,
      EditionBadge,
      Step,
    },

    computed: {
      ...mapState({
        activeTrialPlugins: (state) => state.cart.activeTrialPlugins,
        cart: (state) => state.cart.cart,
        craftLogo: (state) => state.craft.craftLogo,
        expiryDateOptions: (state) => state.pluginStore.expiryDateOptions,
      }),

      ...mapGetters({
        cartItems: 'cart/cartItems',
        cartItemsData: 'cart/cartItemsData',
        getPluginLicenseInfo: 'craft/getPluginLicenseInfo',
      }),

      selectedExpiryDates: {
        get() {
          return JSON.parse(
            JSON.stringify(this.$store.state.cart.selectedExpiryDates)
          );
        },
        set(newValue) {
          this.$store.commit('cart/updateSelectedExpiryDates', newValue);
        },
      },
    },

    methods: {
      ...mapActions({
        removeFromCart: 'cart/removeFromCart',
      }),

      itemExpiryDateOptions(itemKey) {
        const item = this.cartItems[itemKey];
        const renewalPrice = item.lineItem.purchasable.renewalPrice;

        let options = [];
        let selectedOption = 0;

        this.expiryDateOptions.forEach((option, key) => {
          if (option === item.lineItem.options.expiryDate) {
            selectedOption = key;
          }
        });

        for (let i = 0; i < this.expiryDateOptions.length; i++) {
          const expiryDateOption = this.expiryDateOptions[i];
          const optionValue = expiryDateOption[0];
          const date = Craft.formatDate(expiryDateOption[1]);
          let label = this.$options.filters.t('Updates until {date}', 'app', {
            date,
          });
          let price = renewalPrice * (i - selectedOption);

          if (price !== 0) {
            let sign = '';

            if (price > 0) {
              sign = '+';
            }

            price = this.$options.filters.currency(price);
            label = this.$options.filters.t(
              'Updates until {date} ({sign}{price})',
              'app',
              {date, sign, price}
            );
          }

          options.push({
            label: label,
            value: optionValue,
          });
        }

        return options;
      },

      itemLoading(itemKey) {
        if (!this.loadingItems[itemKey]) {
          return false;
        }

        return true;
      },

      onSelectedExpiryDateChange(itemKey) {
        this.$set(this.loadingItems, itemKey, true);
        let item = this.cartItemsData[itemKey];
        item.expiryDate = this.selectedExpiryDates[itemKey];
        this.$store.dispatch('cart/updateItem', {itemKey, item}).then(() => {
          this.$delete(this.loadingItems, itemKey);
        });
      },

      payment() {
        // Redirect to Craft Console with the order number
        this.$store.dispatch('cart/getOrderNumber').then((orderNumber) => {
          window.location.href = `${window.craftIdEndpoint}/cart?orderNumber=${orderNumber}`;
        });
      },

      removeFromCart(itemKey) {
        this.$set(this.loadingRemoveFromCart, itemKey, true);

        this.$store
          .dispatch('cart/removeFromCart', itemKey)
          .then(() => {
            this.$delete(this.loadingRemoveFromCart, itemKey);
          })
          .catch((response) => {
            this.$delete(this.loadingRemoveFromCart, itemKey);
            const errorMessage =
              response.errors &&
              response.errors[0] &&
              response.errors[0].message
                ? response.errors[0].message
                : 'Couldn’t remove item from cart.';
            this.$root.displayError(errorMessage);
          });
      },

      removeFromCartLoading(itemKey) {
        if (!this.loadingRemoveFromCart[itemKey]) {
          return false;
        }

        return true;
      },

      pluginLicenseInfo(pluginHandle) {
        return this.getPluginLicenseInfo(pluginHandle);
      },
    },

    mounted() {
      this.$store
        .dispatch('cart/getActiveTrials')
        .then(() => {
          this.activeTrialsLoading = false;
        })
        .catch(() => {
          this.activeTrialsLoading = false;
        });
    },
  };
</script>

<style lang="scss">
  @import '../../../../../../../../../packages/craftcms-sass/mixins';

  table.cart-data {
    border-top: 1px solid #eee;

    thead,
    tbody {
      border-bottom: 1px solid #eee;
    }

    tr {
      th,
      td {
        padding: 7px 0;
      }

      td.expiry-date {
        & > div {
          display: inline-block;
          margin-bottom: 0;
        }

        .c-spinner {
          @apply .relative .ml-4;
          top: 6px;
        }
      }

      td.thin {
        .c-btn {
          white-space: nowrap;
        }
      }
    }

    .item-name {
      .edition-badge {
        @apply .ml-2;
      }
    }

    .plugin-icon {
      margin-right: 10px !important;

      img {
        max-width: none;
      }
    }
  }

  @media (max-width: 991px) {
    table.cart-data {
      thead {
        display: none;
      }

      tr,
      td,
      th {
        display: block;
      }

      tr {
        &.sub-item {
          td.blank-cell,
          td.empty-cell {
            display: none;
          }
        }
      }
    }
  }

  @media (min-width: 992px) {
    table.cart-data {
      tr {
        &.sub-item {
          td:not(.blank-cell) {
            border-top: 1px dotted #eee;
          }
        }

        th,
        td {
          padding: 10px 0;

          &.price {
            text-align: right;
          }

          &.total-price {
            text-align: right;
          }
        }

        td.expiry-date {
          @apply .w-3/5;
        }
      }
    }
  }
</style>
