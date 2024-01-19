import random
import math
import threading
import datetime
import time


#-- 이름, 전일종가, 그래프, json으로 넘길 파일str, 상한가, 하한가, 현재가격 들어있는 종목class --#
class Stock:
	def __init__(self, stock_name, pre_price):
		self.stock_name = stock_name #종목이름
		self.pre_price = pre_price #전일종가
		self.graph_value = [] #그래프 숫자
		self.present_value = []
		self.stock_json = ''
		self.graph_number = 0
		self.random_val = 0
		self.count_arr = [0,0,0,0,0,0,0,0,0,0] #합할용도
		self.count_value = 0 #갯수로셀거
		self.count_data = 0 #가격 누적
		self.default_value = 30
		self.height_value = 0 # 실제 그려질 높이
		self.graph_move = 0 # 음수 양수 확인
		self.prev_match_value = 30 # 시작점

  #하한가
	def low_limit(self):
		return int(self.pre_price - (self.pre_price * 0.3))
	
  #상한가
	def upper_limit(self):
		return int(self.pre_price + (self.pre_price * 0.3))

	#그래프 가격 5개
	def graph_price(self):
		self.graph_value = []
		self.graph_number = (self.pre_price-(self.pre_price*0.04))
		#print(self.graph_number)
		for i in range(5):
			self.graph_number = (self.graph_number + (self.graph_number*0.02))
			self.graph_value.insert(0,int(self.graph_number))
		#print(self.graph_value)
		return self.graph_value

	#실시간 10개 가격(현재가 기준)
	def present_price(self):
		self.present_value = []
		max_val = self.graph_value[0]
		min_val = self.graph_value[-1]
		avg_val = max_val - min_val
		avg_val = avg_val/9
		self.present_value.insert(0, min_val)
		for i in range(9):
			min_val += avg_val
			i = math.floor(min_val)
			self.present_value.insert(0, i)
			#self.random_value = random.choice(self.present_value)
		return self.present_value

	#변동되는 랜덤가격
	def random_price(self):
		self.random_val = 0
		dice_arr = self.present_value
		self.random_val = random.choice(dice_arr)
		#print("주사위 값", self.random_val)
		return self.random_val

	#등략율 계산((랜덤가-전일종가)/전일종가)*100
	def up_down_value(self):
		random_val = self.random_val
		present_val = self.pre_price
		numerator_val = random_val-present_val
		result_val = (numerator_val/present_val)*100
		#print("랜덤값",random_val)
		#print("시가",present_val)
		#print("등락율",round(result_val, 2))
		return round(result_val, 2)
	
	#거래량 카운트 => arr
	def money_count(self):
		self.count_value = 0
		val_index = self.present_value.index(self.random_val)
		#print("배열 랜덤 맞을때 위치 ->",self.present_value.index(self.random_val))
		#print("거래대금 랜덤값일때->",self.random_val)
		random_range = random.randrange(1,5)
		self.count_arr[val_index] += random_range
		self.count_value = random_range
		self.count_data += self.random_val*random_range
		if self.count_data > 99999999999:
			self.count_data = 0
		#print(self.count_arr)
		#print(test_arr)
		return self.count_arr

	# 그래프 등락율 default + random = 기준값, random-기준값 = 다음값 *-1, 기준값보다 값이 작은경우 음수처리
	# 랜덤값 - 기준값 = 다음값 / 기준값 bottom % / 다음값 +경우 상승 -경우 하락 /
  #(lamda x: x*-1 if x < 0 else x)
	def graph_up_down(self):
		focus_val = 0
		focus_val = self.present_value[::-1].index(self.random_val)
		focus_val = (focus_val)*10
		# print("기준이 되는 값", self.default_value)
		# 음수 양수 체크
		self.graph_move = self.default_value-focus_val
		# 이전 값 담기
		self.prev_match_value = self.default_value
		# 다음에 불려올 현재 값 미리 담기
		self.default_value = focus_val
		# print("음수 남아있는용", self.graph_move)
		if self.graph_move < 0:
			self.height_value = self.graph_move * -1
		else:
			self.height_value = self.graph_move
		# print("다음 값", focus_val)
		# print("기준 2 ->", self.default_value)
		return focus_val
		

	def to_string(self):
		return '\n \t \t{'+''' 
		"stockProduct" : "{}", 
		"stockPrePrice" : {:.0f}, 
		"stockLowPrice" : {}, 
		"stockUpperPrice" : {}, 
		"stockGraphValue" : {}, 
		"stockPresentPrice" : {}, 
		"randomPrice" : {}, 
		"upDownPrice" : {},
		"moneyCount" : {},
		"countValue" : {},
		"countData" : {},
		"matchValue" : {},
		"graphMove" : {},
		"heightValue" : {},
		"prevMatchValue" : {}'''.format(
			self.stock_name,
			self.pre_price,
			self.low_limit(),
			self.upper_limit(),
			self.graph_price(),
			self.present_price(),
			self.random_price(),
			self.up_down_value(),
			self.money_count(),
			self.count_value,
			self.count_data,
			self.graph_up_down(),
			self.graph_move,
			self.height_value,
			self.prev_match_value
			) + '''
		}'''

#-- 종목 class 끝 --#

stock_chart = [ 
	Stock("대한항공", 24000),
	Stock("에어부산", 3000),
	Stock("한진", 21000),
	Stock("KCTC",4200),
	Stock("제주항공",13000),
	Stock("진에어",14000),
	Stock("쏘카",13300),
	Stock("티웨이항공",2500),
	Stock("CJ대한통운",77000),
	Stock("HMM",17000)
]


while True:
	
	with open ("../js/stock.json", "w") as file:
		file_str = '{\t"stockList": ['

		for i in range(len(stock_chart)):
			file_str += stock_chart[i].to_string()
			if i < len(stock_chart)-1:
				file_str += ',\t'
		file_str += '\n\t]\n}'
		# print(file_str)

		file.write( file_str )
	time.sleep(3)
		#threading.Timer(3, data_json).start()
		#print(file_str)