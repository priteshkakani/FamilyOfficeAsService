const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://fomyxahwvnfivxvrjtpf.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvbXl4YWh3dm5maXZ4dnJqdHBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5OTgzMDAsImV4cCI6MjA3NTU3NDMwMH0.WT_DEOJ5otbwbhD_trLNa806d08WYwMfk0QWajsFVdw';
const supabase = createClient(supabaseUrl, supabaseKey);

// Test data
const testUserId = 'test-user-' + Date.now();
const testTransaction = {
  user_id: testUserId,
  type: 'buy',
  asset_type: 'stock',
  asset_id: 'test-stock-' + uuidv4(),
  asset_name: 'Test Stock',
  symbol: 'TST',
  quantity: 10,
  price_per_unit: 100,
  total_amount: 1000,
  fee: 10,
  tax: 5,
  transaction_date: new Date().toISOString(),
  notes: 'Test transaction'
};

const testMutualFund = {
  user_id: testUserId,
  name: 'Test Mutual Fund',
  symbol: 'TMF',
  isin: 'TEST' + Math.random().toString(36).substring(2, 12).toUpperCase(),
  nav: 150.75,
  nav_date: new Date().toISOString(),
  investment_type: 'growth',
  risk_level: 'moderate',
  expense_ratio: 0.5,
  aum: 1000000,
  min_investment: 1000,
  exit_load: '1% if redeemed within 1 year',
  notes: 'Test mutual fund'
};

const testStock = {
  user_id: testUserId,
  name: 'Test Stock',
  symbol: 'TST',
  exchange: 'NYSE',
  current_price: 125.50,
  quantity: 100,
  average_buy_price: 120.00,
  investment_value: 12000,
  current_value: 12550,
  profit_loss: 550,
  profit_loss_percentage: 4.58,
  notes: 'Test stock'
};

async function testCRUDOperations() {
  try {
    console.log('Starting API tests...\n');
    
    // Test 1: Create a transaction
    console.log('1. Testing Transaction CRUD:');
    console.log('   - Creating transaction...');
    const { data: createdTx, error: txError } = await supabase
      .from('transactions')
      .insert(testTransaction)
      .select()
      .single();
      
    if (txError) throw txError;
    console.log(`   ✓ Transaction created with ID: ${createdTx.id}`);
    
    // Test 2: Read transaction
    console.log('   - Reading transaction...');
    const { data: readTx, error: readTxError } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', createdTx.id)
      .single();
      
    if (readTxError) throw readTxError;
    console.log(`   ✓ Transaction read successfully: ${readTx.symbol} x ${readTx.quantity}`);
    
    // Test 3: Update transaction
    console.log('   - Updating transaction...');
    const { data: updatedTx, error: updateTxError } = await supabase
      .from('transactions')
      .update({ quantity: 15, total_amount: 1500, notes: 'Updated test transaction' })
      .eq('id', createdTx.id)
      .select()
      .single();
      
    if (updateTxError) throw updateTxError;
    console.log(`   ✓ Transaction updated: Quantity ${updatedTx.quantity}, Total ${updatedTx.total_amount}`);
    
    // Test 4: Create mutual fund
    console.log('\n2. Testing Mutual Fund CRUD:');
    console.log('   - Creating mutual fund...');
    const { data: createdMf, error: mfError } = await supabase
      .from('mutual_funds')
      .insert(testMutualFund)
      .select()
      .single();
      
    if (mfError) throw mfError;
    console.log(`   ✓ Mutual fund created: ${createdMf.name} (${createdMf.symbol})`);
    
    // Test 5: Create stock
    console.log('\n3. Testing Stock CRUD:');
    console.log('   - Creating stock...');
    const { data: createdStock, error: stockError } = await supabase
      .from('stocks')
      .insert(testStock)
      .select()
      .single();
      
    if (stockError) throw stockError;
    console.log(`   ✓ Stock created: ${createdStock.name} (${createdStock.symbol})`);
    
    // Test 6: Query performance summary
    console.log('\n4. Testing Performance Summary:');
    const { data: performance, error: perfError } = await supabase
      .from('stocks')
      .select('*')
      .eq('user_id', testUserId);
      
    if (perfError) throw perfError;
    
    const totalInvestment = performance.reduce((sum, stock) => sum + (stock.investment_value || 0), 0);
    const currentValue = performance.reduce((sum, stock) => sum + (stock.current_value || 0), 0);
    const profitLoss = currentValue - totalInvestment;
    const profitLossPercent = totalInvestment > 0 ? (profitLoss / totalInvestment) * 100 : 0;
    
    console.log(`   - Portfolio Summary:`);
    console.log(`     • Total Investment: $${totalInvestment.toFixed(2)}`);
    console.log(`     • Current Value: $${currentValue.toFixed(2)}`);
    console.log(`     • Profit/Loss: $${profitLoss.toFixed(2)} (${profitLossPercent.toFixed(2)}%)`);
    
    // Test 7: Clean up (delete test data)
    console.log('\n5. Cleaning up test data...');
    
    const { error: delTxError } = await supabase
      .from('transactions')
      .delete()
      .eq('id', createdTx.id);
    if (delTxError) console.error('   ✗ Error deleting transaction:', delTxError.message);
    else console.log('   ✓ Test transaction deleted');
    
    if (createdMf?.id) {
      const { error: delMfError } = await supabase
        .from('mutual_funds')
        .delete()
        .eq('id', createdMf.id);
      if (delMfError) console.error('   ✗ Error deleting mutual fund:', delMfError.message);
      else console.log('   ✓ Test mutual fund deleted');
    }
    
    if (createdStock?.id) {
      const { error: delStockError } = await supabase
        .from('stocks')
        .delete()
        .eq('id', createdStock.id);
      if (delStockError) console.error('   ✗ Error deleting stock:', delStockError.message);
      else console.log('   ✓ Test stock deleted');
    }
    
    console.log('\n✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the tests
testCRUDOperations();
