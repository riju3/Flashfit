import React, { useState } from 'react'
import { FiX } from 'react-icons/fi'
import { FaRulerCombined } from 'react-icons/fa6'

const SIZE_DATA = {
  men: [
    { size: 'S', chest: '36 - 38"', waist: '30 - 32"', shoulder: '17.5"', height: '5\'6" - 5\'8"' },
    { size: 'M', chest: '38 - 40"', waist: '32 - 34"', shoulder: '18.0"', height: '5\'8" - 5\'10"' },
    { size: 'L', chest: '40 - 42"', waist: '34 - 36"', shoulder: '18.5"', height: '5\'10" - 6\'0"' },
    { size: 'XL', chest: '42 - 44"', waist: '36 - 38"', shoulder: '19.0"', height: '6\'0" - 6\'2"' },
    { size: 'XXL', chest: '44 - 46"', waist: '38 - 40"', shoulder: '19.5"', height: '6\'2"+' }
  ],
  women: [
    { size: 'XS', bust: '31 - 33"', waist: '24 - 26"', hips: '34 - 36"', length: '24"' },
    { size: 'S', bust: '33 - 35"', waist: '26 - 28"', hips: '36 - 38"', length: '25"' },
    { size: 'M', bust: '35 - 37"', waist: '28 - 30"', hips: '38 - 40"', length: '26"' },
    { size: 'L', bust: '37 - 39"', waist: '30 - 32"', hips: '40 - 42"', length: '27"' },
    { size: 'XL', bust: '39 - 41"', waist: '32 - 34"', hips: '42 - 44"', length: '28"' }
  ],
  kids: [
    { size: '2-3Y', height: '35 - 38"', chest: '21 - 22"', waist: '20.5"', age: '2-3 Years' },
    { size: '4-5Y', height: '39 - 43"', chest: '23 - 24"', waist: '21.5"', age: '4-5 Years' },
    { size: '6-7Y', height: '44 - 48"', chest: '25 - 26"', waist: '22.5"', age: '6-7 Years' },
    { size: '8-9Y', height: '49 - 53"', chest: '27 - 28"', waist: '24.0"', age: '8-9 Years' },
    { size: '10-12Y', height: '54 - 58"', chest: '29 - 31"', waist: '26.0"', age: '10-12 Years' }
  ]
}

const SizeGuideModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('men')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto animate-fade-in-up">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center border border-orange-100 shadow-sm">
              <FaRulerCombined size={20} />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-fashion-dark">FlashFit Official Size Guide</h2>
              <p className="text-xs text-fashion-gray">Standard measurements for the perfect fit</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-fashion-dark flex items-center justify-center transition-colors font-bold text-sm cursor-pointer"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-gray-100 p-1 rounded-2xl gap-1">
          {['men', 'women', 'kids'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-fashion-gray hover:text-fashion-dark'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Size Table */}
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
          <table className="w-full text-xs text-left text-fashion-dark">
            <thead className="bg-orange-50/60 text-orange-600 font-extrabold uppercase text-[11px] border-b border-orange-100">
              <tr>
                <th className="p-3">Size</th>
                {activeTab === 'men' && (
                  <>
                    <th className="p-3">Chest</th>
                    <th className="p-3">Waist</th>
                    <th className="p-3">Shoulder</th>
                  </>
                )}
                {activeTab === 'women' && (
                  <>
                    <th className="p-3">Bust</th>
                    <th className="p-3">Waist</th>
                    <th className="p-3">Hips</th>
                  </>
                )}
                {activeTab === 'kids' && (
                  <>
                    <th className="p-3">Age Group</th>
                    <th className="p-3">Height</th>
                    <th className="p-3">Chest</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {SIZE_DATA[activeTab].map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50/60 transition-colors">
                  <td className="p-3 font-extrabold text-orange-600">{row.size}</td>
                  {activeTab === 'men' && (
                    <>
                      <td className="p-3">{row.chest}</td>
                      <td className="p-3">{row.waist}</td>
                      <td className="p-3">{row.shoulder}</td>
                    </>
                  )}
                  {activeTab === 'women' && (
                    <>
                      <td className="p-3">{row.bust}</td>
                      <td className="p-3">{row.waist}</td>
                      <td className="p-3">{row.hips}</td>
                    </>
                  )}
                  {activeTab === 'kids' && (
                    <>
                      <td className="p-3 font-semibold">{row.age}</td>
                      <td className="p-3">{row.height}</td>
                      <td className="p-3">{row.chest}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tip Box */}
        <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl text-xs text-amber-800 space-y-1">
          <p className="font-bold">💡 How to Measure Yourself:</p>
          <p className="text-[11px] leading-relaxed text-amber-900/80">
            • <strong>Chest / Bust:</strong> Measure around the fullest part of your chest under your arms.<br />
            • <strong>Waist:</strong> Measure around your natural waistline keeping the tape comfortably loose.
          </p>
        </div>

      </div>
    </div>
  )
}

export default SizeGuideModal
