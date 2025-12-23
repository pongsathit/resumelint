export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-surface-border bg-white dark:bg-background-dark py-12 px-6">
      <div className="max-w-[1280px] mx-auto w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary text-2xl">terminal</span>
              <span className="text-xl font-bold dark:text-white">resumelint</span>
            </div>
            <p className="text-gray-500 text-sm max-w-xs mb-6">
              The intelligent resume assistant built for the modern software engineering ecosystem.
            </p>
            <div className="flex gap-4">
              <a className="text-gray-400 hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined">mail</span></a>
              <a className="text-gray-400 hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined">public</span></a>
              <a className="text-gray-400 hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined">rss_feed</span></a>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="font-bold dark:text-white mb-2">Product</h4>
            <a className="text-gray-500 hover:text-primary text-sm" href="#">Features</a>
            <a className="text-gray-500 hover:text-primary text-sm" href="#">Pricing</a>
            <a className="text-gray-500 hover:text-primary text-sm" href="#">Testimonials</a>
            <a className="text-gray-500 hover:text-primary text-sm" href="#">Integration</a>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="font-bold dark:text-white mb-2">Resources</h4>
            <a className="text-gray-500 hover:text-primary text-sm" href="#">Resume Templates</a>
            <a className="text-gray-500 hover:text-primary text-sm" href="#">Career Blog</a>
            <a className="text-gray-500 hover:text-primary text-sm" href="#">Salary Guide</a>
            <a className="text-gray-500 hover:text-primary text-sm" href="#">Help Center</a>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="font-bold dark:text-white mb-2">Legal</h4>
            <a className="text-gray-500 hover:text-primary text-sm" href="#">Privacy Policy</a>
            <a className="text-gray-500 hover:text-primary text-sm" href="#">Terms of Service</a>
            <a className="text-gray-500 hover:text-primary text-sm" href="#">Cookie Policy</a>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-surface-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">© 2023 Resumelint Inc. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-gray-500 text-sm font-medium">Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
