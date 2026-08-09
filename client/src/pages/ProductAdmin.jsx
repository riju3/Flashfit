import React, { useEffect, useState, useMemo } from 'react'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import Loading from '../components/Loading'
import { IoSearchOutline } from "react-icons/io5"
import EditProductAdmin from '../components/EditProductAdmin'
import { MdEdit, MdDelete, MdInventory, MdCheckCircle, MdCancel } from 'react-icons/md'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import { FiArrowUp, FiArrowDown, FiPackage, FiAlertTriangle, FiTrash2 } from 'react-icons/fi'
import { BsToggleOn, BsToggleOff, BsBagCheck, BsCurrencyDollar } from 'react-icons/bs'
import CofirmBox from '../components/CofirmBox'
import toast from 'react-hot-toast'

const StockBadge = ({ stock }) => {
  if (stock === 0 || stock === null)
    return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">Out of Stock</span>
  if (stock <= 5)
    return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">Low ({stock})</span>
  return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-200">In Stock ({stock})</span>
}

const SORT_COLS = ['name', 'price', 'stock', 'discount', 'date']
const FILTER_STATUS = ['all', 'in-stock', 'low-stock', 'out-of-stock']

const ProductAdmin = () => {
  const [productData, setProductData] = useState([])
  const [page,        setPage]        = useState(1)
  const [loading,     setLoading]     = useState(false)
  const [totalPageCount, setTotalPageCount] = useState(1)
  const [search,      setSearch]      = useState('')
  const [editProduct, setEditProduct] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  // Selection state for Bulk Actions
  const [selectedIds, setSelectedIds] = useState([])
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false)
  const [bulkActionLoading, setBulkActionLoading] = useState(false)

  // Sort / Filter
  const [sortCol,    setSortCol]    = useState('date')
  const [sortDir,    setSortDir]    = useState('desc')
  const [filterStatus, setFilterStatus] = useState('all')

  const fetchProductData = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getProduct,
        data: { page, limit: 50, search }
      })
      const { data: responseData } = response
      if (responseData.success) {
        setTotalPageCount(responseData.totalNoPage)
        setProductData(responseData.data)
      }
    } catch (error) { AxiosToastError(error) }
    finally { setLoading(false) }
  }

  const [sizesUpdating, setSizesUpdating] = useState(false)
  const handleUpdateAllSizes = async () => {
    try {
      setSizesUpdating(true)
      const response = await Axios({ ...SummaryApi.updateAllSizes })
      const { data: responseData } = response
      if (responseData.success) {
        toast.success(`✅ Updated ${responseData.updatedCount} products | Skipped ${responseData.skippedCount ?? 0} (already set or no size needed)`)
        fetchProductData()
      }
    } catch (error) { AxiosToastError(error) }
    finally { setSizesUpdating(false) }
  }

  useEffect(() => { fetchProductData() }, [page])

  useEffect(() => {
    const t = setTimeout(() => { fetchProductData() }, 350)
    return () => clearTimeout(t)
  }, [search])

  // Single delete
  const handleDelete = async () => {
    try {
      const res = await Axios({ ...SummaryApi.deleteProduct, data: { _id: deleteTarget._id } })
      if (res.data.success) {
        toast.success('Product deleted')
        setDeleteTarget(null)
        setSelectedIds(prev => prev.filter(id => id !== deleteTarget._id))
        fetchProductData()
      }
    } catch (err) { AxiosToastError(err) }
  }

  // Bulk Delete
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      setBulkActionLoading(true);
      const res = await Axios({
        ...SummaryApi.bulkDeleteProducts,
        data: { ids: selectedIds }
      });
      if (res.data.success) {
        toast.success(`🗑️ Deleted ${res.data.deletedCount} products`);
        setSelectedIds([]);
        setBulkDeleteConfirm(false);
        fetchProductData();
      }
    } catch (err) { AxiosToastError(err); }
    finally { setBulkActionLoading(false); }
  };

  // Bulk Publish / Unpublish
  const handleBulkPublishStatus = async (publishStatus) => {
    if (selectedIds.length === 0) return;
    try {
      setBulkActionLoading(true);
      const res = await Axios({
        ...SummaryApi.bulkPublishProducts,
        data: { ids: selectedIds, publish: publishStatus }
      });
      if (res.data.success) {
        toast.success(`✨ Updated publish status for ${selectedIds.length} products`);
        setSelectedIds([]);
        fetchProductData();
      }
    } catch (err) { AxiosToastError(err); }
    finally { setBulkActionLoading(false); }
  };

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(col); setSortDir('asc') }
  }

  // Computed display data
  const displayData = useMemo(() => {
    let arr = [...productData]
    if (filterStatus === 'in-stock')    arr = arr.filter(p => p.stock > 5)
    if (filterStatus === 'low-stock')   arr = arr.filter(p => p.stock > 0 && p.stock <= 5)
    if (filterStatus === 'out-of-stock') arr = arr.filter(p => !p.stock || p.stock === 0)
    arr.sort((a, b) => {
      let va, vb
      if (sortCol === 'name')     { va = a.name; vb = b.name; return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va) }
      if (sortCol === 'price')    { va = a.price; vb = b.price }
      if (sortCol === 'stock')    { va = a.stock || 0; vb = b.stock || 0 }
      if (sortCol === 'discount') { va = a.discount || 0; vb = b.discount || 0 }
      if (sortCol === 'date')     { va = new Date(a.createdAt); vb = new Date(b.createdAt) }
      return sortDir === 'asc' ? va - vb : vb - va
    })
    return arr
  }, [productData, sortCol, sortDir, filterStatus])

  // Select all / toggle row selections
  const isAllSelected = useMemo(() => {
    if (displayData.length === 0) return false;
    return displayData.every(p => selectedIds.includes(p._id));
  }, [displayData, selectedIds]);

  const toggleSelectAll = () => {
    if (isAllSelected) {
      const currentIds = displayData.map(p => p._id);
      setSelectedIds(prev => prev.filter(id => !currentIds.includes(id)));
    } else {
      const currentIds = displayData.map(p => p._id);
      setSelectedIds(prev => Array.from(new Set([...prev, ...currentIds])));
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Summary stats
  const totalStock = productData.reduce((s, p) => s + (p.stock || 0), 0)
  const totalValue = productData.reduce((s, p) => s + (p.price || 0) * (p.stock || 0), 0)
  const outOfStock = productData.filter(p => !p.stock || p.stock === 0).length

  const SortIcon = ({ col }) =>
    sortCol === col
      ? sortDir === 'asc' ? <FiArrowUp size={11} className="text-primary-200"/> : <FiArrowDown size={11} className="text-primary-200"/>
      : <FiArrowDown size={11} className="text-gray-300"/>

  return (
    <section className="bg-fashion-light min-h-screen relative pb-20">
      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-20 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold text-fashion-dark" style={{fontFamily:'Playfair Display,serif'}}>Product Inventory</h1>
            <p className="text-xs text-fashion-gray">{productData.length} products total</p>
          </div>
          {/* Search + Update Sizes Button */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2 bg-fashion-light border border-gray-200 rounded-xl px-3 py-2 w-full sm:w-64 focus-within:border-primary-200 transition-colors">
              <IoSearchOutline size={16} className="text-fashion-gray flex-shrink-0"/>
              <input
                type="text"
                placeholder="Search products..."
                className="bg-transparent outline-none text-sm w-full text-fashion-dark placeholder-fashion-gray"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }}
              />
            </div>
            <button
              onClick={handleUpdateAllSizes}
              disabled={sizesUpdating}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl text-white transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-60"
              style={{background:'linear-gradient(135deg,#6366F1,#8B5CF6)'}}
            >
              {sizesUpdating ? '⏳ Updating...' : '📐 Update All Sizes'}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="container mx-auto px-4 py-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Products', value: productData.length,              icon: <BsBagCheck size={18} className="text-primary-200" /> },
          { label: 'Total Stock',    value: totalStock.toLocaleString(),      icon: <FiPackage size={18} className="text-blue-500" /> },
          { label: 'Out of Stock',   value: outOfStock,                       icon: <FiAlertTriangle size={18} className="text-amber-500" /> },
          { label: 'Stock Value',    value: DisplayPriceInRupees(totalValue), icon: <BsCurrencyDollar size={18} className="text-green-600" /> },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 shadow-card">
            <div className="w-8 h-8 rounded-lg bg-fashion-light flex items-center justify-center mb-2">
              {stat.icon}
            </div>
            <p className="text-xs text-fashion-gray uppercase tracking-wide">{stat.label}</p>
            <p className="text-lg font-bold text-fashion-dark mt-0.5">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* ── Filter tabs + Table ── */}
      <div className="container mx-auto px-4 pb-8">
        {/* Status filter pills */}
        <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-none">
          {FILTER_STATUS.map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border capitalize transition-all
                ${filterStatus === s ? 'text-white border-transparent shadow-orange' : 'border-gray-200 text-fashion-charcoal bg-white hover:border-primary-100'}`}
              style={filterStatus === s ? {background:'linear-gradient(135deg,#FF4D00,#E94560)'} : {}}
            >
              {s.replace('-', ' ')}
            </button>
          ))}
        </div>

        {loading ? <Loading /> : (
          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-fashion-light">
                    <th className="px-4 py-3 text-left w-10">
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 accent-primary-200 cursor-pointer rounded"
                        title="Select All / Deselect All"
                      />
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-fashion-gray">Product</th>
                    {[
                      { label: 'Category', col: null },
                      { label: 'Price',    col: 'price' },
                      { label: 'Stock',    col: 'stock' },
                      { label: 'Discount', col: 'discount' },
                      { label: 'Status',   col: null },
                    ].map(h => (
                      <th
                        key={h.label}
                        className="text-left px-3 py-3 text-xs font-bold uppercase tracking-wider text-fashion-gray cursor-pointer hover:text-primary-200 transition-colors"
                        onClick={() => h.col && handleSort(h.col)}
                      >
                        <span className="flex items-center gap-1">
                          {h.label}
                          {h.col && <SortIcon col={h.col} />}
                        </span>
                      </th>
                    ))}
                    <th className="text-left px-3 py-3 text-xs font-bold uppercase tracking-wider text-fashion-gray">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {displayData.map((p, i) => (
                    <tr
                      key={p._id + i}
                      className={`hover:bg-fashion-light transition-colors group ${selectedIds.includes(p._id) ? 'bg-orange-50/50' : ''}`}
                    >
                      {/* Checkbox */}
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(p._id)}
                          onChange={() => toggleSelectOne(p._id)}
                          className="w-4 h-4 accent-primary-200 cursor-pointer rounded"
                        />
                      </td>

                      {/* Product */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3 min-w-48">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-fashion-light flex-shrink-0 border border-gray-100">
                            <img src={p.image?.[0]} alt={p.name} className="w-full h-full object-cover"/>
                          </div>
                          <div>
                            <p className="font-semibold text-fashion-dark text-sm line-clamp-2 leading-snug max-w-40">{p.name}</p>
                            {p.tags?.map(t => (
                              <span key={t} className="text-[9px] font-bold mr-1 px-1.5 py-0.5 rounded-full"
                                style={{
                                  background: t === 'new-arrival' ? '#22C55E' : t === 'trending' ? '#FF4D00' : t === 'sale' ? '#E94560' : '#C9A84C',
                                  color: t === 'best-seller' ? '#111' : '#fff'
                                }}>
                                {t.replace('-',' ').toUpperCase()}
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>
                      {/* Category */}
                      <td className="px-3 py-3">
                        <p className="text-xs text-fashion-gray">
                          {p.category?.map(c => c.name).join(', ') || '—'}
                        </p>
                      </td>
                      {/* Price */}
                      <td className="px-3 py-3">
                        <p className="font-semibold text-fashion-dark">{DisplayPriceInRupees(pricewithDiscount(p.price, p.discount))}</p>
                        {p.discount > 0 && <p className="text-xs text-fashion-gray line-through">{DisplayPriceInRupees(p.price)}</p>}
                      </td>
                      {/* Stock */}
                      <td className="px-3 py-3">
                        <StockBadge stock={p.stock} />
                      </td>
                      {/* Discount */}
                      <td className="px-3 py-3">
                        {p.discount > 0
                          ? <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{p.discount}%</span>
                          : <span className="text-xs text-fashion-gray">—</span>
                        }
                      </td>
                      {/* Publish status */}
                      <td className="px-3 py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full
                          ${p.publish ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-gray-100 text-fashion-gray border border-gray-200'}`}>
                          {p.publish ? 'Live' : 'Draft'}
                        </span>
                      </td>
                      {/* Actions */}
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setEditProduct(p)}
                            className="p-2 rounded-lg text-fashion-gray hover:text-primary-200 hover:bg-primary-50 transition-all"
                            title="Edit"
                          >
                            <MdEdit size={16}/>
                          </button>
                          <button
                            onClick={() => setDeleteTarget(p)}
                            className="p-2 rounded-lg text-fashion-gray hover:text-red-500 hover:bg-red-50 transition-all"
                            title="Delete"
                          >
                            <MdDelete size={16}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {displayData.length === 0 && !loading && (
                <div className="text-center py-16">
                  <div className="w-12 h-12 rounded-full bg-fashion-light flex items-center justify-center mx-auto mb-3">
                    <FiPackage size={22} className="text-fashion-gray" />
                  </div>
                  <p className="font-semibold text-fashion-dark">No products found</p>
                  <p className="text-sm text-fashion-gray mt-1">Try adjusting your search or filter</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPageCount > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-1.5 rounded-lg text-sm font-semibold border border-gray-200 disabled:opacity-40 hover:border-primary-200 hover:text-primary-200 transition-all"
                >
                  Previous
                </button>
                <span className="text-sm text-fashion-gray">
                  Page <span className="font-bold text-fashion-dark">{page}</span> of <span className="font-bold text-fashion-dark">{totalPageCount}</span>
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPageCount, p + 1))}
                  disabled={page === totalPageCount}
                  className="px-4 py-1.5 rounded-lg text-sm font-semibold border border-gray-200 disabled:opacity-40 hover:border-primary-200 hover:text-primary-200 transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Floating Action Bar for Selected Products ── */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-fashion-dark text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-4 border border-gray-700 animate-slideUp">
          <div className="flex items-center gap-2 pr-2 border-r border-gray-700">
            <span className="w-6 h-6 rounded-full bg-primary-200 text-white text-xs font-bold flex items-center justify-center">
              {selectedIds.length}
            </span>
            <span className="text-xs font-semibold">Selected</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkPublishStatus(true)}
              disabled={bulkActionLoading}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
            >
              <MdCheckCircle size={14}/> Publish
            </button>

            <button
              onClick={() => handleBulkPublishStatus(false)}
              disabled={bulkActionLoading}
              className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
            >
              <MdCancel size={14}/> Unpublish
            </button>

            <button
              onClick={() => setBulkDeleteConfirm(true)}
              disabled={bulkActionLoading}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
            >
              <FiTrash2 size={14}/> Delete Selected
            </button>
          </div>

          <button
            onClick={() => setSelectedIds([])}
            className="text-xs text-gray-400 hover:text-white underline pl-2"
          >
            Deselect
          </button>
        </div>
      )}

      {/* Edit modal */}
      {editProduct && (
        <EditProductAdmin data={editProduct} close={() => setEditProduct(null)} fetchProductData={fetchProductData} />
      )}

      {/* Single Delete confirm */}
      {deleteTarget && (
        <CofirmBox
          close={() => setDeleteTarget(null)}
          cancel={() => setDeleteTarget(null)}
          confirm={handleDelete}
        />
      )}

      {/* Bulk Delete confirm modal */}
      {bulkDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4 animate-scaleUp">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <FiTrash2 size={24} />
            </div>
            <div>
              <h3 className="text-base font-bold text-fashion-dark">Delete {selectedIds.length} Products?</h3>
              <p className="text-xs text-fashion-gray mt-1">This action cannot be undone. Are you sure you want to delete these products permanently?</p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setBulkDeleteConfirm(false)}
                className="flex-1 py-2 rounded-xl text-xs font-bold border border-gray-200 text-fashion-gray hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={bulkActionLoading}
                className="flex-1 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50"
              >
                {bulkActionLoading ? 'Deleting...' : 'Yes, Delete All'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default ProductAdmin
