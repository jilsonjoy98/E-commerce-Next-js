import Categories from '@/components/home/categories/Categories';
import Featured from '@/components/home/featured/Featured';
import Promotional from '@/components/home/promotional/Promotional';
import React from 'react';

export default function Page() {
  return (
    <div className="space-y-6 pb-16">
      <Promotional />
      <Categories />
      <Featured />
    </div>
  );
}
