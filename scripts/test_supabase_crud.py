import os
import json
import uuid
import time
from datetime import datetime, timedelta
from supabase import create_client, Client
from typing import Dict, Any, List, Optional, Tuple

class SupabaseCRUDTest:
    def __init__(self):
        self.url: str = os.environ.get("VITE_SUPABASE_URL", "https://fomyxahwvnfivxvrjtpf.supabase.co")
        self.key: str = os.environ.get("VITE_SUPABASE_ANON_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvbXl4YWh3dm5maXZ4dnJqdHBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5OTgzMDAsImV4cCI6MjA3NTU3NDMwMH0.WT_DEOJ5otbwbhD_trLNa806d08WYwMfk0QWajsFVdw")
        self.supabase: Client = create_client(self.url, self.key)
        self.test_user_id = f"test-user-{str(uuid.uuid4())}"
        self.current_time = datetime.now().isoformat()
        self.created_ids: Dict[str, List[str]] = {}

    def run_tests(self):
        """Run all test cases"""
        print("🚀 Starting Supabase CRUD Tests...\n")
        
        try:
            # Test core tables
            self.test_profiles()
            self.test_family_members()
            self.test_documents()
            
            # Test financial tables
            self.test_accounts()
            self.test_categories()
            self.test_transactions()
            
            # Test investment tables
            self.test_stocks()
            self.test_mutual_funds()
            
            # Test planning tables
            self.test_financial_goals()
            self.test_budgets()
            
            # Test liabilities
            self.test_loans()
            self.test_credit_cards()
            
            print("\n✅ All tests completed successfully!")
            
        except Exception as e:
            print(f"\n❌ Test failed: {str(e)}")
            raise
        finally:
            # Clean up all test data
            self.cleanup_test_data()

    def log_success(self, message: str):
        print(f"✅ {message}")
    
    def log_error(self, message: str, error: Optional[Exception] = None):
        error_msg = f"❌ {message}"
        if error:
            error_msg += f"\n   Error: {str(error)}"
        print(error_msg)
    
    def add_created_id(self, table: str, id_value: str):
        """Track created IDs for cleanup"""
        if table not in self.created_ids:
            self.created_ids[table] = []
        self.created_ids[table].append(id_value)
    
    def cleanup_test_data(self):
        """Clean up all test data"""
        print("\n🧹 Cleaning up test data...")
        
        # Delete in reverse order of dependencies
        tables_to_clean = [
            'credit_card_transactions', 'credit_cards',
            'loan_payments', 'loans',
            'budget_actuals', 'budgets',
            'goal_transactions', 'financial_goals',
            'mutual_fund_transactions', 'mutual_fund_sips', 'mutual_fund_nav_history', 'mutual_funds',
            'stock_transactions', 'stock_price_history', 'stock_alerts', 'stock_watchlist', 'stocks',
            'transfers', 'recurring_transactions', 'transactions', 'investment_transactions',
            'categories', 'accounts',
            'documents', 'family_members',
            'profiles'
        ]
        
        for table in tables_to_clean:
            if table in self.created_ids:
                try:
                    self.supabase.table(table).delete().in_('id', self.created_ids[table]).execute()
                    self.log_success(f"Cleaned up {len(self.created_ids[table])} records from {table}")
                except Exception as e:
                    self.log_error(f"Error cleaning up {table}", e)
        
        # Special case for profiles
        try:
            self.supabase.table('profiles').delete().eq('id', self.test_user_id).execute()
            self.log_success(f"Cleaned up test profile: {self.test_user_id}")
        except Exception as e:
            self.log_error("Error cleaning up test profile", e)
    
    # ===== TEST METHODS =====
    
    def test_profiles(self):
        """Test CRUD operations on profiles table"""
        print("\n===== Testing Profiles =====")
        
        # Test data for profile
        test_profile = {
            "id": self.test_user_id,
            "full_name": "Test User",
            "email": f"test-{self.test_user_id}@example.com",
            "phone": "+1234567890",
            "date_of_birth": "1990-01-01",
            "city": "Test City",
            "state": "Test State",
            "country": "Test Country",
            "postal_code": "12345",
            "timezone": "Asia/Kolkata",
            "currency": "INR"
        }
    
        # Test Create Profile
        print("\n1. Creating profile...")
        try:
            result = self.supabase.table('profiles').insert(test_profile).execute()
            self.log_success("Profile created successfully!")
            print(json.dumps(result.data[0], indent=2))
        except Exception as e:
            self.log_error("Error creating profile", e)
            raise
        
        # Test Read Profile
        print("\n2. Reading profile...")
        try:
            result = self.supabase.table('profiles').select("*").eq('id', self.test_user_id).execute()
            if result.data and len(result.data) > 0:
                self.log_success("Profile retrieved successfully!")
                print(json.dumps(result.data[0], indent=2))
            else:
                raise Exception("Profile not found after creation")
        except Exception as e:
            self.log_error("Error reading profile", e)
            raise
        
        # Test Update Profile
        print("\n3. Updating profile...")
        try:
            update_data = {"full_name": "Updated Test User", "city": "Updated City"}
            result = self.supabase.table('profiles').update(update_data).eq('id', self.test_user_id).execute()
            self.log_success("Profile updated successfully!")
            print(json.dumps(result.data[0], indent=2))
        except Exception as e:
            self.log_error("Error updating profile", e)
            raise
    
    def test_family_members(self):
        """Test CRUD operations on family_members table"""
        print("\n===== Testing Family Members =====")
        
        test_member = {
            "user_id": self.test_user_id,
            "full_name": "Test Family Member",
            "relationship": "spouse",
            "date_of_birth": "1992-05-15",
            "phone": "+1234567891",
            "email": f"family-{self.test_user_id}@example.com"
        }
        
        # Create
        print("\n1. Creating family member...")
        try:
            result = self.supabase.table('family_members').insert(test_member).execute()
            member_id = result.data[0]['id']
            self.add_created_id('family_members', member_id)
            self.log_success(f"Family member created with ID: {member_id}")
            
            # Read
            print("\n2. Reading family member...")
            result = self.supabase.table('family_members').select("*").eq('id', member_id).execute()
            if not result.data or len(result.data) == 0:
                raise Exception("Family member not found after creation")
            self.log_success("Family member retrieved successfully!")
            
            # Update
            print("\n3. Updating family member...")
            update_data = {"full_name": "Updated Family Member", "relationship": "child"}
            result = self.supabase.table('family_members').update(update_data).eq('id', member_id).execute()
            self.log_success("Family member updated successfully!")
            
        except Exception as e:
            self.log_error("Error in family_members CRUD", e)
            raise
    
    def test_documents(self):
        """Test CRUD operations on documents table"""
        print("\n===== Testing Documents =====")
        
        test_doc = {
            "user_id": self.test_user_id,
            "title": "Test Document",
            "description": "A test document",
            "document_type": "passport",
            "file_url": "https://example.com/test.pdf",
            "expiry_date": (datetime.now() + timedelta(days=365)).strftime('%Y-%m-%d')
        }
        
        try:
            # Create
            print("\n1. Creating document...")
            result = self.supabase.table('documents').insert(test_doc).execute()
            doc_id = result.data[0]['id']
            self.add_created_id('documents', doc_id)
            self.log_success(f"Document created with ID: {doc_id}")
            
            # Read
            print("\n2. Reading document...")
            result = self.supabase.table('documents').select("*").eq('id', doc_id).execute()
            if not result.data or len(result.data) == 0:
                raise Exception("Document not found after creation")
            self.log_success("Document retrieved successfully!")
            
            # Update
            print("\n3. Updating document...")
            update_data = {"title": "Updated Test Document", "description": "Updated description"}
            result = self.supabase.table('documents').update(update_data).eq('id', doc_id).execute()
            self.log_success("Document updated successfully!")
            
            # Delete
            print("\n4. Deleting document...")
            self.supabase.table('documents').delete().eq('id', doc_id).execute()
            self.log_success("Document deleted successfully!")
            
        except Exception as e:
            self.log_error("Error in documents CRUD", e)
            raise
    
    def test_accounts(self):
        """Test CRUD operations on accounts table"""
        print("\n===== Testing Accounts =====")
        
        test_account = {
            "user_id": self.test_user_id,
            "name": "Test Bank Account",
            "account_type": "savings",
            "balance": 1000.00,
            "currency": "INR",
            "account_number": "1234567890",
            "bank_name": "Test Bank"
        }
        
        try:
            # Create
            print("\n1. Creating account...")
            result = self.supabase.table('accounts').insert(test_account).execute()
            account_id = result.data[0]['id']
            self.add_created_id('accounts', account_id)
            self.log_success(f"Account created with ID: {account_id}")
            
            # Read
            print("\n2. Reading account...")
            result = self.supabase.table('accounts').select("*").eq('id', account_id).execute()
            if not result.data or len(result.data) == 0:
                raise Exception("Account not found after creation")
            self.log_success("Account retrieved successfully!")
            
            # Update
            print("\n3. Updating account...")
            update_data = {"balance": 1500.00, "name": "Updated Test Account"}
            result = self.supabase.table('accounts').update(update_data).eq('id', account_id).execute()
            self.log_success("Account updated successfully!")
            
            return account_id
            
        except Exception as e:
            self.log_error("Error in accounts CRUD", e)
            raise
    
    def test_categories(self):
        """Test CRUD operations on categories table"""
        print("\n===== Testing Categories =====")
        
        test_category = {
            "user_id": self.test_user_id,
            "name": "Test Category",
            "description": "A test category",
            "type": "expense",
            "color": "#FF5733"
        }
        
        try:
            # Create
            print("\n1. Creating category...")
            result = self.supabase.table('categories').insert(test_category).execute()
            category_id = result.data[0]['id']
            self.add_created_id('categories', category_id)
            self.log_success(f"Category created with ID: {category_id}")
            
            # Read
            print("\n2. Reading category...")
            result = self.supabase.table('categories').select("*").eq('id', category_id).execute()
            if not result.data or len(result.data) == 0:
                raise Exception("Category not found after creation")
            self.log_success("Category retrieved successfully!")
            
            # Update
            print("\n3. Updating category...")
            update_data = {"name": "Updated Test Category", "color": "#33FF57"}
            result = self.supabase.table('categories').update(update_data).eq('id', category_id).execute()
            self.log_success("Category updated successfully!")
            
            return category_id
            
        except Exception as e:
            self.log_error("Error in categories CRUD", e)
            raise
    
    def test_transactions(self):
        """Test CRUD operations on transactions table"""
        print("\n===== Testing Transactions =====")
        
        # First create an account and category for the transaction
        account_id = self.test_accounts()
        category_id = self.test_categories()
        
        test_transaction = {
            "user_id": self.test_user_id,
            "account_id": account_id,
            "category_id": category_id,
            "amount": 100.50,
            "description": "Test transaction",
            "transaction_date": self.current_time,
            "type": "expense",
            "status": "completed"
        }
        
        try:
            # Create
            print("\n1. Creating transaction...")
            result = self.supabase.table('transactions').insert(test_transaction).execute()
            transaction_id = result.data[0]['id']
            self.add_created_id('transactions', transaction_id)
            self.log_success(f"Transaction created with ID: {transaction_id}")
            
            # Read
            print("\n2. Reading transaction...")
            result = self.supabase.table('transactions').select("*").eq('id', transaction_id).execute()
            if not result.data or len(result.data) == 0:
                raise Exception("Transaction not found after creation")
            self.log_success("Transaction retrieved successfully!")
            
            # Update
            print("\n3. Updating transaction...")
            update_data = {"amount": 150.75, "description": "Updated test transaction"}
            result = self.supabase.table('transactions').update(update_data).eq('id', transaction_id).execute()
            self.log_success("Transaction updated successfully!")
            
            return transaction_id
            
        except Exception as e:
            self.log_error("Error in transactions CRUD", e)
            raise
    
    def test_stocks(self):
        """Test CRUD operations on stocks and related tables"""
        print("\n===== Testing Stocks =====")
        
        test_stock = {
            "user_id": self.test_user_id,
            "symbol": "TST",
            "name": "Test Stock",
            "exchange": "NSE",
            "quantity": 100,
            "average_buy_price": 150.25,
            "current_price": 160.50
        }
        
        try:
            # Create stock
            print("\n1. Creating stock...")
            result = self.supabase.table('stocks').insert(test_stock).execute()
            stock_id = result.data[0]['id']
            self.add_created_id('stocks', stock_id)
            self.log_success(f"Stock created with ID: {stock_id}")
            
            # Test stock transaction
            test_transaction = {
                "user_id": self.test_user_id,
                "stock_id": stock_id,
                "transaction_type": "buy",
                "quantity": 50,
                "price_per_share": 150.25,
                "total_amount": 7512.50,
                "transaction_date": self.current_time,
                "notes": "Test stock purchase"
            }
            
            print("\n2. Creating stock transaction...")
            result = self.supabase.table('stock_transactions').insert(test_transaction).execute()
            transaction_id = result.data[0]['id']
            self.add_created_id('stock_transactions', transaction_id)
            self.log_success(f"Stock transaction created with ID: {transaction_id}")
            
            # Test stock price history
            test_price = {
                "stock_id": stock_id,
                "date": datetime.now().strftime('%Y-%m-%d'),
                "open_price": 150.00,
                "high_price": 161.00,
                "low_price": 149.50,
                "close_price": 160.50,
                "volume": 100000
            }
            
            print("\n3. Adding stock price history...")
            result = self.supabase.table('stock_price_history').insert(test_price).execute()
            self.log_success("Stock price history added successfully!")
            
            return stock_id
            
        except Exception as e:
            self.log_error("Error in stocks CRUD", e)
            raise
    
    def test_mutual_funds(self):
        """Test CRUD operations on mutual_funds and related tables"""
        print("\n===== Testing Mutual Funds =====")
        
        test_mf = {
            "user_id": self.test_user_id,
            "name": "Test Mutual Fund",
            "symbol": "TMF",
            "isin": f"TEST{str(uuid.uuid4())[:8]}",
            "nav": 150.75,
            "nav_date": datetime.now().strftime('%Y-%m-%d'),
            "investment_type": "growth",
            "risk_level": "moderate"
        }
        
        try:
            # Create mutual fund
            print("\n1. Creating mutual fund...")
            result = self.supabase.table('mutual_funds').insert(test_mf).execute()
            mf_id = result.data[0]['id']
            self.add_created_id('mutual_funds', mf_id)
            self.log_success(f"Mutual fund created with ID: {mf_id}")
            
            # Test mutual fund transaction
            test_transaction = {
                "user_id": self.test_user_id,
                "mutual_fund_id": mf_id,
                "transaction_type": "purchase",
                "units": 10.5,
                "nav": 150.75,
                "amount": 1582.88,
                "transaction_date": self.current_time,
                "notes": "Test MF purchase"
            }
            
            print("\n2. Creating mutual fund transaction...")
            result = self.supabase.table('mutual_fund_transactions').insert(test_transaction).execute()
            transaction_id = result.data[0]['id']
            self.add_created_id('mutual_fund_transactions', transaction_id)
            self.log_success(f"Mutual fund transaction created with ID: {transaction_id}")
            
            return mf_id
            
        except Exception as e:
            self.log_error("Error in mutual funds CRUD", e)
            raise
    
    def test_financial_goals(self):
        """Test CRUD operations on financial_goals table"""
        print("\n===== Testing Financial Goals =====")
        
        test_goal = {
            "user_id": self.test_user_id,
            "name": "Test Goal",
            "target_amount": 1000000.00,
            "current_amount": 10000.00,
            "target_date": (datetime.now() + timedelta(days=365*5)).strftime('%Y-%m-%d'),
            "priority": "high",
            "notes": "Test financial goal"
        }
        
        try:
            # Create goal
            print("\n1. Creating financial goal...")
            result = self.supabase.table('financial_goals').insert(test_goal).execute()
            goal_id = result.data[0]['id']
            self.add_created_id('financial_goals', goal_id)
            self.log_success(f"Financial goal created with ID: {goal_id}")
            
            # Test goal transaction
            transaction_id = self.test_transactions()
            
            test_goal_tx = {
                "goal_id": goal_id,
                "transaction_id": transaction_id,
                "amount": 5000.00
            }
            
            print("\n2. Linking transaction to goal...")
            result = self.supabase.table('goal_transactions').insert(test_goal_tx).execute()
            goal_tx_id = result.data[0]['id']
            self.add_created_id('goal_transactions', goal_tx_id)
            self.log_success(f"Goal transaction linked with ID: {goal_tx_id}")
            
            return goal_id
            
        except Exception as e:
            self.log_error("Error in financial goals CRUD", e)
            raise
    
    def test_budgets(self):
        """Test CRUD operations on budgets table"""
        print("\n===== Testing Budgets =====")
        
        category_id = self.test_categories()
        
        test_budget = {
            "user_id": self.test_user_id,
            "name": "Test Budget",
            "category_id": category_id,
            "amount": 1000.00,
            "period": "monthly",
            "start_date": datetime.now().strftime('%Y-%m-%d'),
            "end_date": (datetime.now() + timedelta(days=30)).strftime('%Y-%m-%d'),
            "notes": "Test budget"
        }
        
        try:
            # Create budget
            print("\n1. Creating budget...")
            result = self.supabase.table('budgets').insert(test_budget).execute()
            budget_id = result.data[0]['id']
            self.add_created_id('budgets', budget_id)
            self.log_success(f"Budget created with ID: {budget_id}")
            
            # Test budget actuals
            test_actual = {
                "budget_id": budget_id,
                "period_start_date": datetime.now().strftime('%Y-%m-%d'),
                "period_end_date": (datetime.now() + timedelta(days=30)).strftime('%Y-%m-%d'),
                "budgeted_amount": 1000.00,
                "actual_amount": 850.00,
                "remaining_amount": 150.00
            }
            
            print("\n2. Adding budget actuals...")
            result = self.supabase.table('budget_actuals').insert(test_actual).execute()
            self.add_created_id('budget_actuals', result.data[0]['budget_id'])
            self.log_success("Budget actuals added successfully!")
            
            return budget_id
            
        except Exception as e:
            self.log_error("Error in budgets CRUD", e)
            raise
    
    def test_loans(self):
        """Test CRUD operations on loans table"""
        print("\n===== Testing Loans =====")
        
        test_loan = {
            "user_id": self.test_user_id,
            "name": "Test Loan",
            "loan_type": "personal",
            "principal_amount": 100000.00,
            "interest_rate": 10.5,
            "term_months": 60,
            "start_date": datetime.now().strftime('%Y-%m-%d'),
            "lender_name": "Test Bank",
            "status": "active"
        }
        
        try:
            # Create loan
            print("\n1. Creating loan...")
            result = self.supabase.table('loans').insert(test_loan).execute()
            loan_id = result.data[0]['id']
            self.add_created_id('loans', loan_id)
            self.log_success(f"Loan created with ID: {loan_id}")
            
            # Test loan payment
            test_payment = {
                "loan_id": loan_id,
                "amount": 2000.00,
                "payment_date": datetime.now().strftime('%Y-%m-%d'),
                "principal_amount": 1500.00,
                "interest_amount": 500.00,
                "notes": "Test loan payment"
            }
            
            print("\n2. Adding loan payment...")
            result = self.supabase.table('loan_payments').insert(test_payment).execute()
            payment_id = result.data[0]['id']
            self.add_created_id('loan_payments', payment_id)
            self.log_success(f"Loan payment added with ID: {payment_id}")
            
            return loan_id
            
        except Exception as e:
            self.log_error("Error in loans CRUD", e)
            raise
    
    def test_credit_cards(self):
        """Test CRUD operations on credit_cards table"""
        print("\n===== Testing Credit Cards =====")
        
        test_card = {
            "user_id": self.test_user_id,
            "card_name": "Test Credit Card",
            "issuer": "Test Bank",
            "card_number": "************1234",
            "expiry_date": (datetime.now() + timedelta(days=365*3)).strftime('%Y-%m-%d'),
            "credit_limit": 100000.00,
            "current_balance": 25000.00,
            "due_date": 15,
            "billing_cycle_day": 1
        }
        
        try:
            # Create credit card
            print("\n1. Creating credit card...")
            result = self.supabase.table('credit_cards').insert(test_card).execute()
            card_id = result.data[0]['id']
            self.add_created_id('credit_cards', card_id)
            self.log_success(f"Credit card created with ID: {card_id}")
            
            # Test credit card transaction
            test_transaction = {
                "credit_card_id": card_id,
                "amount": 5000.00,
                "description": "Test credit card transaction",
                "transaction_date": datetime.now().strftime('%Y-%m-%d'),
                "category": "shopping",
                "status": "posted"
            }
            
            print("\n2. Adding credit card transaction...")
            result = self.supabase.table('credit_card_transactions').insert(test_transaction).execute()
            transaction_id = result.data[0]['id']
            self.add_created_id('credit_card_transactions', transaction_id)
            self.log_success(f"Credit card transaction added with ID: {transaction_id}")
            
            return card_id
            
        except Exception as e:
            self.log_error("Error in credit cards CRUD", e)
            raise

def main():
    # Run the tests
    tester = SupabaseCRUDTest()
    tester.run_tests()

if __name__ == "__main__":
    main()
