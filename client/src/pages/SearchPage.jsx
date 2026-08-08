import React, { useEffect, useState } from 'react'
import CardLoading from '../components/CardLoading'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import CardProduct from '../components/CardProduct'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useLocation } from 'react-router-dom'
import { IoSearch } from 'react-icons/io5'

const SearchPage = () => {
  const [data,      setData]      = useState([])
  const [loading,   setLoading]   = useState(true)
  const [page,      setPage]      = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const params     = useLocation()
  
  const queryParams = new URLSearchParams(params.search)
  const searchText  = queryParams.get('q') || ''
  const tagText     = queryParams.get('tag') || ''

  const fetchData = async (pageNum = 1, reset = false) => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.searchProduct,
        data: { search: searchText, tag: tagText, page: pageNum, limit: 24 }
      })
      const { data: responseData } = response
      if (responseData.success) {
        if (reset || pageNum === 1) {
          setData(responseData.data)
        } else {
          setData(prev => [...prev, ...responseData.data])
        }
        setTotalPage(responseData.totalPage)
      }
    } catch (error) { AxiosToastError(error) }
    finally { setLoading(false) }
  }

  useEffect(() => {
    setPage(1)
    fetchData(1, true)
  }, [searchText, tagText])

  const handleFetchMore = () => {
    if (page < totalPage) {
      const next = page + 1
      setPage(next)
      fetchData(next)
    }
  }

  return (
    <section className="bg-fashion-light min-h-screen">
      <div className="container mx-auto px-4 py-6">

        {/* ── Results header ── */}
        <div className="mb-6">
          {searchText ? (
            <>
              <p className="text-xs font-bold uppercase tracking-widest text-primary-200 mb-1">
                Search Results
              </p>
              <h1 className="text-xl lg:text-2xl font-bold text-fashion-dark" style={{ fontFamily: 'Playfair Display, serif' }}>
                "{searchText}"
              </h1>
              {!loading && (
                <p className="text-sm text-fashion-gray mt-1">
                  {data.length} item{data.length !== 1 ? 's' : ''} found
                </p>
              )}
            </>
          ) : tagText ? (
            <>
              <p className="text-xs font-bold uppercase tracking-widest text-primary-200 mb-1">Curated Collection</p>
              <h1 className="text-xl lg:text-2xl font-bold text-fashion-dark capitalize" style={{ fontFamily: 'Playfair Display, serif' }}>
                {tagText.replace('-', ' ')} Items
              </h1>
            </>
          ) : (
            <>
              <p className="text-xs font-bold uppercase tracking-widest text-primary-200 mb-1">Explore</p>
              <h1 className="text-xl lg:text-2xl font-bold text-fashion-dark" style={{ fontFamily: 'Playfair Display, serif' }}>
                All Branded Fashion Products
              </h1>
              {!loading && (
                <p className="text-sm text-fashion-gray mt-1">
                  Showing {data.length} items from our complete store catalog
                </p>
              )}
            </>
          )}
        </div>

        {/* ── Loading state ── */}
        {loading && data.length === 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array(10).fill(null).map((_, i) => <CardLoading key={'searchload' + i} />)}
          </div>
        )}

        {/* ── Results grid ── */}
        {data.length > 0 && (
          <InfiniteScroll
            dataLength={data.length}
            hasMore={page < totalPage}
            next={handleFetchMore}
            loader={
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                {Array(5).fill(null).map((_, i) => <CardLoading key={'moreload' + i} />)}
              </div>
            }
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {data.map((p, index) => (
                <CardProduct data={p} key={p?._id + 'searchProduct' + index} />
              ))}
            </div>
          </InfiniteScroll>
        )}

        {/* ── No results ── */}
        {!loading && data.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
              style={{ background: 'linear-gradient(135deg, #FFF0E8, #FFF0F3)' }}
            >
              <IoSearch size={32} className="text-primary-200" />
            </div>
            <h2 className="text-lg font-bold text-fashion-dark mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              No results found
            </h2>
            <p className="text-sm text-fashion-gray max-w-xs">
              We couldn't find anything for <span className="font-semibold text-fashion-dark">"{searchText}"</span>.
              Try different keywords or browse our categories.
            </p>
            <div className="flex gap-2 mt-5 flex-wrap justify-center">
              {['Shirts', 'Jeans', 'Dresses', 'Sneakers', 'Kurtas'].map(s => (
                <a
                  key={s}
                  href={`/search?q=${s.toLowerCase()}`}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-200 text-fashion-charcoal hover:border-primary-200 hover:text-primary-200 bg-white transition-all"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default SearchPage
