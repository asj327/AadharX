// HealthChain Frontend - Connect to Backend
const API_BASE = "http://localhost:8000";

// 1. Test Backend Connection
async function testBackend() {
    try {
        const response = await fetch(`${API_BASE}/health`);
        const data = await response.json();
        
        // Show status on page
        document.getElementById('backendStatus').innerHTML = 
            `✅ Backend: ${data.status}`;
        document.getElementById('backendStatus').style.color = 'green';
        
        return true;
    } catch (error) {
        document.getElementById('backendStatus').innerHTML = 
            '❌ Backend offline - Start server with: uvicorn main:app --reload';
        document.getElementById('backendStatus').style.color = 'red';
        return false;
    }
}

// 2. Emergency Access Form
async function getEmergencyData() {
    const aadhaar = document.getElementById('emergencyAadhaar').value;
    
    if (!aadhaar || aadhaar.length !== 12) {
        alert('Please enter a valid 12-digit Aadhaar number');
        return;
    }
    
    // Show loading
    document.getElementById('emergencyResults').innerHTML = 
        '<div class="loading">🔄 Accessing medical data...</div>';
    
    try {
        const response = await fetch(
            `${API_BASE}/emergency/${aadhaar}?hospital_key=HOSPITAL123`
        );
        const data = await response.json();
        
        // Display results
        displayEmergencyResults(data);
    } catch (error) {
        document.getElementById('emergencyResults').innerHTML = 
            `<div class="error">❌ Error: ${error.message}</div>`;
    }
}

// 3. Display Emergency Results
function displayEmergencyResults(data) {
    if (data.error) {
        document.getElementById('emergencyResults').innerHTML = 
            `<div class="error">❌ ${data.error}</div>`;
        return;
    }
    
    const patient = data.emergency_data;
    let html = `
        <div class="emergency-card">
            <h3>🏥 Patient Medical Data</h3>
            <p><strong>Name:</strong> ${patient.name}</p>
            <p><strong>Blood Type:</strong> ${patient.blood_type}</p>
            
            <div class="critical-alert">
                <h4>⚠️ ${patient.warning}</h4>
            </div>
            
            <p><strong>Allergies:</strong> ${patient.allergies.join(', ')}</p>
            <p><strong>Conditions:</strong> ${patient.conditions.join(', ')}</p>
            
            <div class="privacy-note">
                <h4>🔒 Privacy Protection Active</h4>
                <p>${data.restricted.govt_data}</p>
                <p>${data.restricted.financial_data}</p>
            </div>
        </div>
    `;
    
    document.getElementById('emergencyResults').innerHTML = html;
}

// 4. Form Auto-fill
async function autoFillForm() {
    const aadhaar = document.getElementById('formAadhaar').value;
    const formType = document.getElementById('formType').value;
    
    if (!aadhaar) {
        alert('Please enter Aadhaar number');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/forms/${aadhaar}/${formType}`);
        const data = await response.json();
        
        if (data.error) {
            alert(data.error);
            return;
        }
        
        // Auto-fill form fields
        document.getElementById('formName').value = data.auto_filled.name || '';
        document.getElementById('formDOB').value = data.auto_filled.dob || '';
        document.getElementById('formAddress').value = data.auto_filled.address || '';
        
        // Show time saved
        document.getElementById('timeSaved').innerText = 
            `⏱️ Time saved: ${data.time_saved}`;
        
    } catch (error) {
        console.error('Form error:', error);
    }
}

// 5. View Data Vault
async function viewVault() {
    const aadhaar = document.getElementById('vaultAadhaar').value;
    
    if (!aadhaar) {
        alert('Enter Aadhaar to view vault');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/vault/${aadhaar}`);
        const data = await response.json();
        
        if (data.error) {
            alert(data.error);
            return;
        }
        
        displayVault(data);
    } catch (error) {
        console.error('Vault error:', error);
    }
}

// 6. Display Vault
function displayVault(data) {
    const vaults = data.data_vaults;
    let html = `
        <div class="vault-card">
            <h3>🔐 Data Vault - ${data.name}</h3>
            <p>Aadhaar: ${data.aadhaar}</p>
            
            <div class="vault-section medical">
                <h4>🏥 Medical Vault</h4>
                <p>${vaults.medical.status}</p>
                <p>Last accessed: ${vaults.medical.last_accessed}</p>
                <p>Contains: ${vaults.medical.data_includes.join(', ')}</p>
            </div>
            
            <div class="vault-section govt">
                <h4>🏛️ Government Vault</h4>
                <p>${vaults.government.status}</p>
                <p>Last accessed: ${vaults.government.last_accessed}</p>
                <p>Contains: ${vaults.government.data_includes.join(', ')}</p>
            </div>
            
            <div class="vault-section financial">
                <h4>🏦 Financial Vault</h4>
                <p>${vaults.financial.status}</p>
                <p>Last accessed: ${vaults.financial.last_accessed}</p>
                <p>Contains: ${vaults.financial.data_includes.join(', ')}</p>
            </div>
            
            <p class="privacy-note">${data.privacy_note}</p>
        </div>
    `;
    
    document.getElementById('vaultResults').innerHTML = html;
}

// Initialize on page load
window.onload = function() {
    testBackend();
    
    // Set default Aadhaar for demo
    document.getElementById('emergencyAadhaar').value = '123456789012';
    document.getElementById('formAadhaar').value = '123456789012';
    document.getElementById('vaultAadhaar').value = '123456789012';
    
    // Auto-test emergency for demo
    setTimeout(() => {
        if (confirm('Run demo? Click OK to auto-fill emergency data.')) {
            getEmergencyData();
        }
    }, 1000);
};