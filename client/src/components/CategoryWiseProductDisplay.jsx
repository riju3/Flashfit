import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import CardProduct from './CardProduct'
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6"
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'
import { FiArrowRight } from 'react-icons/fi'

const SkeletonCard = () => (
  <div className="flex-shrink-0 w-44 md:w-52 lg:w-56 rounded-xl overflow-hidden">
    <div className="skeleton aspect-[3/4] rounded-xl" />
    <div className="p-3 space-y-2">
      <div className="skeleton h-3 rounded-md w-3/4" />
      <div className="skeleton h-3 rounded-md w-1/2" />
      <div className="skeleton h-3 rounded-md w-1/3" />
    </div>
  </div>
)

const CategoryWiseProductDisplay = ({ id, name }) => {
  const [data,    setData]    = useState([])
  const [loading, setLoading] = useState(false)
  const containerRef = useRef()
  const subCategoryData = useSelector(state => state.product.allSubCategory)

  const fetchCategoryWiseProduct = async () => {
    try {
      setLoading(true)
      const response = await Axios({ ...SummaryApi.getProductByCategory, data: { id } })
      const { data: responseData } = response
      if (responseData.success) setData(responseData.data)
    } catch (error) { AxiosToastError(error) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchCategoryWiseProduct() }, [])

  const handleScrollRight = () => { containerRef.current.scrollLeft += 220 }
  const handleScrollLeft  = () => { containerRef.current.scrollLeft -= 220 }

  const getRedirectUrl = () => {
    const sub = subCategoryData.find(s => s.category.some(c => c._id === id))
    if (!sub) return '/'
    return `/${valideURLConvert(name)}-${id}/${valideURLConvert(sub.name)}-${sub._id}`
  }

  if (!loading && data.length === 0) return null

  return (
    <section className="py-8">
      {/* Section header */}
      <div className="container mx-auto px-4 mb-4 flex items-end justify-between">
        <div>
          <p className="section-subheading text-primary-200 mb-1">Browse</p>
          <h2 className="section-heading">{name}</h2>
        </div>
        <Link
          to={getRedirectUrl()}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-1 text-sm font-semibold text-primary-200 hover:text-primary-100 transition-colors group"
        >
          See All
          <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Horizontal scroll row */}
      <div className="relative">
        <div
          ref={containerRef}
          className="flex gap-4 container mx-auto px-4 overflow-x-auto scrollbar-none scroll-smooth"
        >
          {loading
            ? Array(6).fill(null).map((_, i) => <SkeletonCard key={i} />)
            : data.map((p, i) => (
              <div key={p._id + 'cwpd' + i} className="flex-shrink-0 w-44 md:w-52 lg:w-56">
                <CardProduct data={p} />
              </div>
            ))
          }
        </div>

        {/* Scroll arrows */}
        {data.length > 4 && (
          <div className="absolute inset-y-0 left-0 right-0 container mx-auto px-2 hidden lg:flex items-center justify-between pointer-events-none">
            <button
              onClick={handleScrollLeft}
              className="z-10 pointer-events-auto bg-white hover:bg-fashion-light shadow-dark text-fashion-charcoal hover:text-primary-200 p-2.5 rounded-full transition-all hover:scale-110"
            >
              <FaAngleLeft size={14}/>
            </button>
            <button
              onClick={handleScrollRight}
              className="z-10 pointer-events-auto bg-white hover:bg-fashion-light shadow-dark text-fashion-charcoal hover:text-primary-200 p-2.5 rounded-full transition-all hover:scale-110"
            >
              <FaAngleRight size={14}/>
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default CategoryWiseProductDisplay
