#!/usr/bin/env ruby
# require 'rspec'
# require 'open3'
# require 'json'
require 'fileutils'

src_dir = File.expand_path(File.join(File.dirname(__FILE__), '../src/complete'))
src_files = Dir[File.join(src_dir, 'App.test.complete*')]
temp_files = []
src_files.each do |src_file|
  m = src_file.match(/complete(-\d+)/)
  appendage = m ? m[1] : ''
  temp_file = File.join(src_dir, "App.complete#{appendage}.test.js")
  FileUtils.cp src_file, temp_file
  temp_files << temp_file
end

system 'CI=true npm test'

temp_files.each do |temp_file|
  FileUtils.rm temp_file
end

#
# RSpec.describe 'testing/basics' do
#
#   describe 'no framework' do
#     before :each do
#       babel_node = File.expand_path(File.join(
#         File.dirname(__FILE__), '../node_modules/.bin/babel-node')
#       )
#       cmd = "#{babel_node} #{file}"
#       stdin, stdout, stderr, wait_thr = Open3.popen3(cmd)
#
#       status = wait_thr.value
#       if !status.success?
#         raise "Command failed: #{cmd}"
#       end
#
#       @results = stdout.readlines
#     end
#
#     describe 'Modash.test-1.js' do
#       let(:file) do
#         File.expand_path(File.join(
#           File.dirname(__FILE__), '../complete/Modash.test-1.js'
#         ))
#       end
#
#       it "outputs a single line" do
#         expect(@results.size).to eq(1)
#       end
#
#       it "outputs PASS text" do
#         expect(
#           @results.select { |r| r.match(/^\s*\[PASS\]/) }.size
#         ).to eq(1)
#       end
#     end
#
#     describe 'Modash.test-2.js' do
#       let(:file) do
#         File.expand_path(File.join(
#           File.dirname(__FILE__), '../complete/Modash.test-2.js'
#         ))
#       end
#
#       it "outputs five lines" do
#         expect(@results.size).to eq(5)
#       end
#
#       it "outputs five PASSes" do
#         expect(
#           @results.select { |r| r.match(/^\s*\[PASS\]/) }.size
#         ).to eq(5)
#       end
#     end
#   end
#
#   describe 'Modash.test-[3-6].js' do
#
#     before :all do
#       jest = File.expand_path(File.join(
#         File.dirname(__FILE__), '../node_modules/.bin/jest')
#       )
#       cmd = "#{jest} --config __fs/jest.conf.json --json"
#
#       # Courtesy http://tech.natemurray.com/2007/03/ruby-shell-commands.html :D :D :D
#       stdin, stdout, stderr, wait_thr = Open3.popen3(cmd)
#
#       unless ENV['SUPRESS_JEST_OUTPUT']
#         stderr.each_line { |l| puts l }
#       end
#
#       status = wait_thr.value
#
#       if !status.success?
#         raise "Jest returned an exception: `#{stderr.readlines.join}`"
#       end
#
#       @results = JSON.parse(stdout.read)
#     end
#
#     it "should run four suites" do
#       expect(@results['numTotalTestSuites']).to eq(4)
#     end
#
#     it "should have zero failures" do
#       expect(@results['numFailedTests']).to eq(0)
#     end
#   end
# end
