function About() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          About Us
        </h1>
        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <p className="text-lg leading-relaxed">
            Welcome to MyApp, where innovation meets excellence. We're dedicated to providing 
            cutting-edge solutions that empower businesses and individuals to achieve their goals.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 my-8">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-3">Our Mission</h3>
              <p className="text-gray-700 dark:text-gray-300">
                To deliver exceptional digital experiences that drive growth and create lasting value for our clients.
              </p>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-300 mb-3">Our Vision</h3>
              <p className="text-gray-700 dark:text-gray-300">
                To be the leading platform that transforms how people interact with technology globally.
              </p>
            </div>
          </div>
          
          <div className="border-l-4 border-blue-600 pl-6 my-8">
            <p className="text-lg italic text-gray-600 dark:text-gray-400">
              "Excellence is not a skill, it's an attitude. We bring passion and dedication to everything we do."
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">100+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Projects</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">50+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Clients</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">5+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Years</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">20+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Team Members</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
