# แผนการทดสอบระบบ BMI WebApp (Testing Plan)

เอกสารนี้รวบรวมกลยุทธ์และรายละเอียดการทดสอบระบบ (Test Strategy) สำหรับ BMI WebApp โดยครอบคลุมทั้งการทดสอบแบบอัตโนมัติ (Automated Testing) ด้วย Playwright และแนวทางการทดสอบเพิ่มเติม

## 1. ภาพรวม (Overview)
เป้าหมายของการทดสอบคือเพื่อให้มั่นใจว่าฟังก์ชันหลักของระบบทำงานได้อย่างถูกต้อง มีความเสถียร และมอบประสบการณ์ที่ดีแก่ผู้ใช้งาน โดยเน้นที่ User Journey ตั้งแต่การสมัครสมาชิกไปจนถึงการบันทึกและดูข้อมูล

- **Type of Testing**: End-to-End (E2E) Testing
- **Framework**: Playwright
- **Browser**: Chromium (Google Chrome)

## 2. การเตรียมสภาพแวดล้อม (Environment Setup)
ก่อนเริ่มการทดสอบ ต้องตรวจสอบความพร้อมของระบบดังนี้:
1. **Node.js**: ติดตั้ง Node.js (แนะนำรุ่น LTS)
2. **Dependencies**: ติดตั้ง packages ที่จำเป็นด้วยคำสั่ง `npm install`
3. **Playwright Browsers**: ติดตั้ง browser สำหรับทดสอบด้วยคำสั่ง `npx playwright install --with-deps`
4. **Database**: ระบบใช้ SQLite (`sqlite.db`) ซึ่งจะถูกสร้างอัตโนมัติเมื่อรันแอปพลิเคชัน

## 3. รายละเอียด Test Cases (Automated E2E)
ไฟล์ทดสอบหลักอยู่ที่ [`tests/bmi.spec.ts`](tests/bmi.spec.ts) ครอบคลุม 5 กรณีทดสอบ (Test Cases) ดังนี้:

### Case 1: User Registration (การสมัครสมาชิก)
- **Objective**: ตรวจสอบว่าผู้ใช้ใหม่สามารถสมัครสมาชิกได้สำเร็จ
- **Steps**:
  1. เข้าสู่หน้า `/register`
  2. กรอกข้อมูล Email, Password, Display Name
  3. กดปุ่ม "สมัครสมาชิก"
- **Expected Result**: ระบบพาไปยังหน้า Login (`/login`)

### Case 2: User Login (การเข้าสู่ระบบ)
- **Objective**: ตรวจสอบว่าผู้ใช้สามารถเข้าสู่ระบบด้วยข้อมูลที่สมัครไว้ได้
- **Steps**:
  1. เข้าสู่หน้า `/login`
  2. กรอก Email และ Password ที่ถูกต้อง
  3. กดปุ่ม "Login"
- **Expected Result**: ระบบพาไปยังหน้า Dashboard (`/dashboard`) และแสดงชื่อผู้ใช้

### Case 3: Record BMI (การบันทึกค่า BMI)
- **Objective**: ตรวจสอบการคำนวณ BMI และการบันทึกข้อมูล
- **Steps**:
  1. เข้าสู่หน้า `/bmi/new`
  2. กรอก Date, Weight (kg), Height (m), Note
  3. ตรวจสอบการคำนวณ BMI แบบ Real-time บนหน้าจอ
  4. กดปุ่ม "Save"
- **Expected Result**: ข้อมูลถูกบันทึกและระบบพาไปยังหน้าประวัติ (`/bmi/history`)

### Case 4: Verify BMI History (การตรวจสอบประวัติ)
- **Objective**: ตรวจสอบว่าข้อมูลที่บันทึกไว้แสดงผลถูกต้องในตารางประวัติ
- **Steps**:
  1. เข้าสู่หน้า `/bmi/history`
  2. ค้นหาแถวที่มีข้อมูลที่เพิ่งบันทึก (ตรวจสอบจาก Note หรือค่า BMI)
- **Expected Result**: พบข้อมูลที่บันทึกไว้ (Weight, Height, BMI Value) แสดงผลถูกต้อง

### Case 5: Logout (การออกจากระบบ)
- **Objective**: ตรวจสอบฟังก์ชันการออกจากระบบ
- **Steps**:
  1. อยู่ที่หน้า Dashboard (`/dashboard`)
  2. กดปุ่ม "Logout"
- **Expected Result**: ระบบพาผู้ใช้กลับไปยังหน้า Login (`/login`) และไม่สามารถเข้าหน้า Dashboard ได้อีกหากไม่ Login ใหม่

## 4. การทดสอบด้วยตนเอง (Manual & Exploratory Testing)
นอกเหนือจาก Automated Tests แนะนำให้ทำการทดสอบด้วยตนเองในหัวข้อต่อไปนี้:

- **Input Validation**:
  - ลองกรอกน้ำหนักหรือส่วนสูงเป็น 0 หรือค่าติดลบ (ระบบควรป้องกันและแจ้งเตือน)
  - ลองกรอกส่วนสูงผิดหน่วย (เช่น 170 แทนที่จะเป็น 1.70) ระบบควรมีการแจ้งเตือน (Warning)
- **Responsive Design**:
  - ทดสอบการแสดงผลบนหน้าจอมือถือและแท็บเล็ต
- **Security Basics**:
  - ลองเข้าถึงหน้า `/dashboard` โดยไม่ Login (ควรถูก Redirect ไปหน้า Login)

## 5. คำสั่งสำหรับรัน Test (Running Tests)
สามารถรันการทดสอบผ่าน Terminal ได้ด้วยคำสั่ง:

```bash
# รันการทดสอบทั้งหมด (Headless mode)
npx playwright test

# รันแบบเห็นหน้าจอ Browser (UI mode)
npx playwright test --ui

# ดูรายงานผลการทดสอบล่าสุด
npx playwright show-report
```

## 6. แผนการในอนาคต (Future Improvements)
- **API Testing**: เพิ่มการทดสอบ API Routes โดยตรง (`/api/*`) เพื่อตรวจสอบ Logic หลังบ้านแยกจาก UI
- **CI/CD Integration**: นำ Test Suite ไปรันอัตโนมัติใน GitHub Actions เมื่อมีการ Push Code
- **Cross-browser Testing**: เพิ่มการทดสอบบน Firefox และ WebKit (Safari) เพื่อความครอบคลุมมากขึ้น
