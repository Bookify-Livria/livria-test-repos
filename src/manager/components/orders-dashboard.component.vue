<script>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { OrderApiService } from '../../commerce/orders/services/order-api.service.js'

export default {
  name: "OrdersDashboard",
  setup() {
    const router = useRouter();
    const orders = ref([]);
    const stats = ref({
      totalOrders: 0,
      totalRevenue: 0,
      pendingOrders: 0,
      completedOrders: 0,
      averageOrderValue: 0,
      mostPopularBook: null
    });
    const loading = ref(true);
    const selectedStatus = ref('all');
    const dateRange = ref('all');
    const sortOption = ref('date_desc');
    const searchQuery = ref('');
    const showOrderModal = ref(false);
    const currentOrder = ref(null);
    const formErrors = ref({});

    // Status options
    const statusOptions = ref([
      { value: 'pending', label: 'Pendiente' },
      { value: 'processing', label: 'Procesando' },
      { value: 'shipped', label: 'Enviado' },
      { value: 'delivered', label: 'Entregado' },
      { value: 'cancelled', label: 'Cancelado' }
    ]);

    // Date range options
    const dateRangeOptions = ref([
      { value: 'today', label: 'Hoy' },
      { value: 'week', label: 'Esta Semana' },
      { value: 'month', label: 'Este Mes' },
      { value: 'year', label: 'Este Año' },
      { value: 'all', label: 'Todo el Tiempo' }
    ]);

    const loadOrders = async () => {
      try {
        loading.value = true;
        const service = new OrderApiService();
        const data = await service.getOrders();
        orders.value = data;

        // Calculate statistics
        calculateStats(data);

        loading.value = false;
      } catch (error) {
        console.error('Error loading orders:', error);
        loading.value = false;
      }
    };

    const calculateStats = (orders) => {
      if (!orders.length) return;

      stats.value.totalOrders = orders.length;

      // Calculate total revenue
      stats.value.totalRevenue = orders.reduce((sum, order) => {
        return sum + (order.total || 0);
      }, 0);

      // Count pending and completed orders
      stats.value.pendingOrders = orders.filter(order =>
          ['pending', 'processing'].includes(order.status)).length;

      stats.value.completedOrders = orders.filter(order =>
          order.status === 'delivered').length;

      // Calculate average order value
      stats.value.averageOrderValue = stats.value.totalRevenue / orders.length;

      // Find most popular book (the book that appears in most orders)
      const bookOccurrences = {};
      orders.forEach(order => {
        order.items?.forEach(item => {
          if (!bookOccurrences[item.bookId]) {
            bookOccurrences[item.bookId] = {
              count: 0,
              title: item.title
            };
          }
          bookOccurrences[item.bookId].count += item.quantity || 1;
        });
      });

      // Find book with highest count
      let mostPopular = { count: 0, title: 'N/A' };
      Object.values(bookOccurrences).forEach(book => {
        if (book.count > mostPopular.count) {
          mostPopular = book;
        }
      });

      stats.value.mostPopularBook = mostPopular.title;
    };

    const isWithinDateRange = (date, range) => {
      if (range === 'all') return true;

      const orderDate = new Date(date);
      const today = new Date();

      // Reset hours for accurate day comparison
      today.setHours(0, 0, 0, 0);

      const todayTimestamp = today.getTime();

      // Calculate start of week (Sunday)
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const startOfWeekTimestamp = startOfWeek.getTime();

      // Calculate start of month
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const startOfMonthTimestamp = startOfMonth.getTime();

      // Calculate start of year
      const startOfYear = new Date(today.getFullYear(), 0, 1);
      const startOfYearTimestamp = startOfYear.getTime();

      const orderTimestamp = orderDate.getTime();

      switch (range) {
        case 'today':
          return orderDate.toDateString() === today.toDateString();
        case 'week':
          return orderTimestamp >= startOfWeekTimestamp;
        case 'month':
          return orderTimestamp >= startOfMonthTimestamp;
        case 'year':
          return orderTimestamp >= startOfYearTimestamp;
        default:
          return true;
      }
    };

    const filteredOrders = computed(() => {
      let filtered = [...orders.value];

      // Filter by status
      if (selectedStatus.value !== 'all') {
        filtered = filtered.filter(order => order.status === selectedStatus.value);
      }

      // Filter by date range
      if (dateRange.value !== 'all') {
        filtered = filtered.filter(order => isWithinDateRange(order.orderDate, dateRange.value));
      }

      // Filter by search query
      if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(order =>
            order.orderNumber.toLowerCase().includes(query) ||
            order.customerName.toLowerCase().includes(query) ||
            order.customerEmail.toLowerCase().includes(query)
        );
      }

      // Sort orders
      filtered.sort((a, b) => {
        switch (sortOption.value) {
          case 'date_asc':
            return new Date(a.orderDate) - new Date(b.orderDate);
          case 'date_desc':
            return new Date(b.orderDate) - new Date(a.orderDate);
          case 'total_asc':
            return a.total - b.total;
          case 'total_desc':
            return b.total - a.total;
          default:
            return 0;
        }
      });

      return filtered;
    });

    const viewOrderDetails = (order) => {
      currentOrder.value = { ...order };
      showOrderModal.value = true;
    };

    const getStatusColor = (status) => {
      switch (status) {
        case 'pending':
          return 'status-pending';
        case 'processing':
          return 'status-processing';
        case 'shipped':
          return 'status-shipped';
        case 'delivered':
          return 'status-delivered';
        case 'cancelled':
          return 'status-cancelled';
        default:
          return '';
      }
    };

    const getStatusLabel = (status) => {
      const statusOption = statusOptions.value.find(option => option.value === status);
      return statusOption ? statusOption.label : status;
    };

    const updateOrderStatus = async (newStatus) => {
      if (!currentOrder.value) return;

      try {
        const service = new OrderApiService();
        await service.updateOrderStatus(currentOrder.value.id, newStatus);

        // Update order in local array
        const index = orders.value.findIndex(order => order.id === currentOrder.value.id);
        if (index !== -1) {
          orders.value[index].status = newStatus;
          currentOrder.value.status = newStatus;
        }

        // Recalculate stats
        calculateStats(orders.value);
      } catch (error) {
        console.error('Error updating order status:', error);
      }
    };

    const closeModal = () => {
      showOrderModal.value = false;
      currentOrder.value = null;
    };

    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatCurrency = (amount) => {
      return `S/ ${amount.toFixed(2)}`;
    };

    onMounted(() => {
      loadOrders();
    });

    return {
      orders,
      stats,
      loading,
      selectedStatus,
      statusOptions,
      dateRange,
      dateRangeOptions,
      sortOption,
      searchQuery,
      filteredOrders,
      showOrderModal,
      currentOrder,
      viewOrderDetails,
      getStatusColor,
      getStatusLabel,
      updateOrderStatus,
      closeModal,
      formatDate,
      formatCurrency
    };
  }
};
</script>

<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h1 class="dashboard-title">{{ $t('orders.title') || 'Gestión de Pedidos' }}</h1>
      <p class="dashboard-subtitle">{{ $t('orders.subtitle') || 'Administra y analiza todos los pedidos de la librería' }}</p>
    </div>

    <div v-if="loading" class="dashboard-loading">
      <p>{{ $t('loading') || 'Cargando datos...' }}</p>
    </div>

    <div v-else class="dashboard-content">
      <!-- Stats Cards -->
      <div class="stats-container">
        <div class="stat-card">
          <h3>{{ $t('orders.total-orders') || 'Total Pedidos' }}</h3>
          <p class="stat-value">{{ stats.totalOrders }}</p>
        </div>
        <div class="stat-card">
          <h3>{{ $t('orders.total-revenue') || 'Ingresos Totales' }}</h3>
          <p class="stat-value">{{ formatCurrency(stats.totalRevenue) }}</p>
        </div>
        <div class="stat-card">
          <h3>{{ $t('orders.pending-orders') || 'Pedidos Pendientes' }}</h3>
          <p class="stat-value">{{ stats.pendingOrders }}</p>
        </div>
        <div class="stat-card">
          <h3>{{ $t('orders.completed-orders') || 'Pedidos Completados' }}</h3>
          <p class="stat-value">{{ stats.completedOrders }}</p>
        </div>
        <div class="stat-card">
          <h3>{{ $t('orders.avg-order-value') || 'Valor Promedio' }}</h3>
          <p class="stat-value">{{ formatCurrency(stats.averageOrderValue) }}</p>
        </div>
        <div class="stat-card">
          <h3>{{ $t('orders.most-popular-book') || 'Libro Más Popular' }}</h3>
          <p class="stat-value">{{ stats.mostPopularBook }}</p>
        </div>
      </div>

      <!-- Filter and Search Options -->
      <div class="filter-section">
        <h2 class="section-title">{{ $t('orders.order-list') || 'Lista de Pedidos' }}</h2>

        <div class="search-bar">
          <input
              type="text"
              v-model="searchQuery"
              :placeholder="$t('orders.search-orders') || 'Buscar por número de pedido o cliente...'"
              class="search-input"
          />
        </div>

        <div class="filter-controls">
          <div class="filter-group">
            <label for="status-filter">{{ $t('orders.filter-by-status') || 'Filtrar por Estado:' }}</label>
            <select id="status-filter" v-model="selectedStatus" class="filter-select">
              <option value="all">{{ $t('orders.all-status') || 'Todos los Estados' }}</option>
              <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                {{ $t(`orders.status.${option.value}`) || option.label }}
              </option>
            </select>
          </div>

          <div class="filter-group">
            <label for="date-filter">{{ $t('orders.filter-by-date') || 'Filtrar por Fecha:' }}</label>
            <select id="date-filter" v-model="dateRange" class="filter-select">
              <option v-for="option in dateRangeOptions" :key="option.value" :value="option.value">
                {{ $t(`orders.date-range.${option.value}`) || option.label }}
              </option>
            </select>
          </div>

          <div class="filter-group">
            <label for="sort-by">{{ $t('orders.sort-by') || 'Ordenar por:' }}</label>
            <select id="sort-by" v-model="sortOption" class="filter-select">
              <option value="date_desc">{{ $t('orders.sort-date-desc') || 'Fecha (Reciente primero)' }}</option>
              <option value="date_asc">{{ $t('orders.sort-date-asc') || 'Fecha (Antiguo primero)' }}</option>
              <option value="total_desc">{{ $t('orders.sort-total-desc') || 'Total (Mayor a Menor)' }}</option>
              <option value="total_asc">{{ $t('orders.sort-total-asc') || 'Total (Menor a Mayor)' }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Orders Table -->
      <div class="orders-table-container">
        <table class="orders-table">
          <thead>
          <tr>
            <th>{{ $t('orders.order-number') || 'N° Pedido' }}</th>
            <th>{{ $t('orders.customer') || 'Cliente' }}</th>
            <th>{{ $t('orders.date') || 'Fecha' }}</th>
            <th>{{ $t('orders.total') || 'Total' }}</th>
            <th>{{ $t('orders.status') || 'Estado' }}</th>
            <th>{{ $t('orders.items') || 'Artículos' }}</th>
            <th>{{ $t('orders.actions') || 'Acciones' }}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="order in filteredOrders" :key="order.id">
            <td><strong># {{ order.orderNumber }}</strong></td>
            <td>
              <div class="customer-info">
                <div class="customer-name">{{ order.customerName }}</div>
                <div class="customer-email">{{ order.customerEmail }}</div>
              </div>
            </td>
            <td>{{ formatDate(order.orderDate) }}</td>
            <td class="order-total">{{ formatCurrency(order.total) }}</td>
            <td>
                <span class="status-badge" :class="getStatusColor(order.status)">
                  {{ getStatusLabel(order.status) }}
                </span>
            </td>
            <td class="items-count">{{ order.items?.length || 0 }}</td>
            <td>
              <button class="btn-view" @click="viewOrderDetails(order)">
                {{ $t('orders.view-details') || 'Ver Detalles' }}
              </button>
            </td>
          </tr>
          </tbody>
        </table>

        <div v-if="filteredOrders.length === 0" class="no-results">
          <p>{{ $t('orders.no-orders-found') || 'No se encontraron pedidos con los filtros seleccionados.' }}</p>
        </div>
      </div>
    </div>

    <!-- Order Details Modal -->
    <div v-if="showOrderModal" class="modal-backdrop">
      <div class="modal-content order-details-modal">
        <div class="modal-header">
          <h2>{{ $t('orders.order-details') || 'Detalles del Pedido' }} #{{ currentOrder.orderNumber }}</h2>
          <button class="close-btn" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body" v-if="currentOrder">
          <div class="order-details-grid">
            <div class="order-info-section">
              <h3>{{ $t('orders.info') || 'Información del Pedido' }}</h3>
              <div class="order-info-grid">
                <div class="info-group">
                  <span class="info-label">{{ $t('orders.order-number') || 'N° Pedido' }}:</span>
                  <span class="info-value"># {{ currentOrder.orderNumber }}</span>
                </div>
                <div class="info-group">
                  <span class="info-label">{{ $t('orders.date') || 'Fecha' }}:</span>
                  <span class="info-value">{{ formatDate(currentOrder.orderDate) }}</span>
                </div>
                <div class="info-group">
                  <span class="info-label">{{ $t('orders.status') || 'Estado' }}:</span>
                  <span class="info-value status-badge" :class="getStatusColor(currentOrder.status)">
                    {{ getStatusLabel(currentOrder.status) }}
                  </span>
                </div>
                <div class="info-group">
                  <span class="info-label">{{ $t('orders.payment-method') || 'Método de Pago' }}:</span>
                  <span class="info-value">{{ currentOrder.paymentMethod || 'N/A' }}</span>
                </div>
              </div>
            </div>

            <div class="customer-info-section">
              <h3>{{ $t('orders.customer-info') || 'Información del Cliente' }}</h3>
              <div class="customer-info-grid">
                <div class="info-group">
                  <span class="info-label">{{ $t('orders.customer-name') || 'Nombre' }}:</span>
                  <span class="info-value">{{ currentOrder.customerName }}</span>
                </div>
                <div class="info-group">
                  <span class="info-label">{{ $t('orders.customer-email') || 'Email' }}:</span>
                  <span class="info-value">{{ currentOrder.customerEmail }}</span>
                </div>
                <div class="info-group">
                  <span class="info-label">{{ $t('orders.customer-phone') || 'Teléfono' }}:</span>
                  <span class="info-value">{{ currentOrder.customerPhone || 'N/A' }}</span>
                </div>
              </div>
            </div>

            <div class="shipping-info-section">
              <h3>{{ $t('orders.shipping-info') || 'Información de Envío' }}</h3>
              <div class="shipping-info-grid">
                <div class="info-group full-width">
                  <span class="info-label">{{ $t('orders.shipping-address') || 'Dirección' }}:</span>
                  <span class="info-value">{{ currentOrder.shippingAddress || 'N/A' }}</span>
                </div>
                <div class="info-group">
                  <span class="info-label">{{ $t('orders.shipping-city') || 'Ciudad' }}:</span>
                  <span class="info-value">{{ currentOrder.shippingCity || 'N/A' }}</span>
                </div>
                <div class="info-group">
                  <span class="info-label">{{ $t('orders.shipping-postal') || 'Código Postal' }}:</span>
                  <span class="info-value">{{ currentOrder.shippingPostal || 'N/A' }}</span>
                </div>
              </div>
            </div>

            <div class="order-items-section">
              <h3>{{ $t('orders.items') || 'Artículos del Pedido' }}</h3>
              <table class="order-items-table">
                <thead>
                <tr>
                  <th>{{ $t('orders.item') || 'Artículo' }}</th>
                  <th>{{ $t('orders.quantity') || 'Cantidad' }}</th>
                  <th>{{ $t('orders.unit-price') || 'Precio Unitario' }}</th>
                  <th>{{ $t('orders.subtotal') || 'Subtotal' }}</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in currentOrder.items" :key="index">
                  <td>
                    <div class="order-item-info">
                      <strong>{{ item.title }}</strong>
                      <small v-if="item.author">{{ item.author }}</small>
                    </div>
                  </td>
                  <td>{{ item.quantity }}</td>
                  <td>{{ formatCurrency(item.unitPrice) }}</td>
                  <td>{{ formatCurrency(item.quantity * item.unitPrice) }}</td>
                </tr>
                </tbody>
              </table>
            </div>

            <div class="order-summary-section">
              <div class="order-totals">
                <div class="total-row">
                  <span>{{ $t('orders.subtotal') || 'Subtotal' }}:</span>
                  <span>{{ formatCurrency(currentOrder.subtotal || currentOrder.total) }}</span>
                </div>
                <div class="total-row" v-if="currentOrder.tax">
                  <span>{{ $t('orders.tax') || 'Impuestos' }}:</span>
                  <span>{{ formatCurrency(currentOrder.tax) }}</span>
                </div>
                <div class="total-row" v-if="currentOrder.shippingCost">
                  <span>{{ $t('orders.shipping-cost') || 'Costo de Envío' }}:</span>
                  <span>{{ formatCurrency(currentOrder.shippingCost) }}</span>
                </div>
                <div class="total-row grand-total">
                  <span>{{ $t('orders.total') || 'Total' }}:</span>
                  <span>{{ formatCurrency(currentOrder.total) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="order-notes" v-if="currentOrder.notes">
            <h3>{{ $t('orders.notes') || 'Notas' }}</h3>
            <p>{{ currentOrder.notes }}</p>
          </div>

          <div class="update-status-section">
            <h3>{{ $t('orders.update-status') || 'Actualizar Estado' }}</h3>
            <div class="status-buttons">
              <button
                  v-for="option in statusOptions"
                  :key="option.value"
                  :class="['status-button', getStatusColor(option.value), { active: currentOrder.status === option.value }]"
                  @click="updateOrderStatus(option.value)"
              >
                {{ $t(`orders.status.${option.value}`) || option.label }}
              </button>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-print" @click="window.print">
            <i class="pi pi-print"></i> {{ $t('orders.print') || 'Imprimir' }}
          </button>
          <button class="btn-close" @click="closeModal">{{ $t('orders.close') || 'Cerrar' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-container {
  width: 100%;
  padding: 2rem;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 2rem;
}

.dashboard-title {
  font-size: 2.2rem;
  font-weight: bold;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
}

.dashboard-subtitle {
  font-size: 1.1rem;
  color: var(--color-text);
  opacity: 0.8;
}

.dashboard-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  font-size: 1.2rem;
  color: var(--color-primary);
}

.dashboard-content {
  max-width: 1400px;
  margin: 0 auto;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.stat-card {
  background-color: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.stat-card h3 {
  font-size: 0.9rem;
  color: var(--color-text);
  opacity: 0.8;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-accent-orange);
}

.filter-section {
  margin-bottom: 2rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 1.5rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 1.5rem;
}

.search-bar {
  margin-bottom: 1.5rem;
}

.search-input {
  width: 100%;
  padding: 0.8rem 1.2rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 1rem;
}

.filter-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.filter-group {
  flex: 1;
  min-width: 200px;
}

.filter-group label {
  display: block;
  margin-bottom: 0.5rem;
}

</style>