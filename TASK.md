# TASK: แผนงานพัฒนา BMI WebApp (Next.js + SQLite)

อ้างอิงจาก: `SRS.md` (BMI WebApp)

---

## Phase 0 – เตรียมโปรเจกต์และเครื่องมือ

## Phase 0 – เตรียมโปรเจกต์และเครื่องมือ

- [x] ติดตั้ง Node.js เวอร์ชันที่รองรับ Next.js ล่าสุด
- [x] สร้างโปรเจกต์ Next.js ใหม่ (ใช้ App Router ถ้าเหมาะสม)
- [x] ติดตั้ง dependency พื้นฐานที่ต้องใช้ เช่น
  - [x] ไลบรารีจัดการ SQLite (เช่น better-sqlite3 หรือที่ทีมเลือก)
  - [x] ไลบรารี auth (ถ้าใช้ NextAuth หรือโซลูชันอื่น)
  - [x] ไลบรารี UI (ถ้าต้องการ เช่น Tailwind / component library)
- [x] สร้างโครงสร้างโฟลเดอร์พื้นฐานให้สอดคล้องกับ SRS
  - [x] pages/routes สำหรับ: Landing, Login, Register, Dashboard, BMI History, BMI Entry, MIS Reports
  - [x] โฟลเดอร์สำหรับ data access / services (เช่น `lib/db`, `lib/repositories`)

---

## Phase 1 – ฐานข้อมูลและเลเยอร์ Data Access

อิง SRS: หมวด 5. ความต้องการด้านฐานข้อมูล

- [x] กำหนดตำแหน่งไฟล์ฐานข้อมูล SQLite (dev / prod)
- [x] ออกแบบ schema สำหรับตาราง Users
  - [x] ฟิลด์: id, email, password_hash, display_name, height_default, created_at, updated_at
- [x] ออกแบบ schema สำหรับตาราง BMI_Records
  - [x] ฟิลด์: id, user_id, record_date, weight, height, bmi_value, bmi_category, note, created_at, updated_at
- [x] สร้างสคริปต์/ฟังก์ชันสำหรับ migration schema
- [x] สร้าง index ตามที่ต้องใช้ในรายงาน
  - [x] BMI_Records.user_id
  - [x] BMI_Records.record_date
- [x] สร้างโมดูลเชื่อมต่อ DB (`lib/db`) และฟังก์ชันพื้นฐาน
  - [x] เปิด/ปิด connection
  - [x] utility สำหรับ query/execute ที่ใช้ซ้ำ

---

## Phase 2 – การจัดการผู้ใช้ (Registration / Login / Profile)

อิง SRS: หมวด 3.1 การจัดการผู้ใช้

### 2.1 Registration

- [x] สร้าง API/route สำหรับสมัครสมาชิก (POST /api/register)
- [x] ตรวจสอบ validation
  - [x] email ไม่ซ้ำ และรูปแบบถูกต้อง
  - [x] password ตามเกณฑ์ความแข็งแรงขั้นต่ำ
- [x] hash รหัสผ่านก่อนบันทึกลง DB (hash + salt)
- [x] บันทึกผู้ใช้ใหม่ลงตาราง Users
- [x] ส่งผลลัพธ์/ข้อความที่เหมาะสมกลับไปยัง frontend

### 2.2 Login / Session

- [x] สร้าง API/route สำหรับเข้าสู่ระบบ (POST /api/login)
- [x] ตรวจสอบ email + password ตรงกับข้อมูลใน DB
- [x] นับจำนวนครั้ง login ล้มเหลว (ถ้าจะจัดเก็บ)
- [x] ป้องกัน brute force ตามเกณฑ์ที่กำหนด (เช่นหน่วงเวลา)
- [x] สร้าง session / token ตามโซลูชันที่เลือก (เช่น NextAuth / custom)
- [x] สร้างฟังก์ชันตรวจสอบ session ที่ใช้ในหน้า protected (Dashboard, BMI ฯลฯ)

### 2.3 Logout

- [x] สร้าง API/route สำหรับออกจากระบบ (POST /api/logout)
- [x] ยกเลิก session/token ปัจจุบัน

### 2.4 User Profile

- [x] สร้าง API/route สำหรับอ่านข้อมูลโปรไฟล์ (GET /api/profile)
- [x] สร้าง API/route สำหรับแก้ไขโปรไฟล์ (PUT/PATCH /api/profile)
- [x] อัปเดต display_name, เพศ (ถ้าใช้), height_default ตามที่กำหนดใน SRS
- [x] ตรวจสอบว่า user แก้ไขได้เฉพาะข้อมูลของตนเอง

---

## Phase 3 – ฟังก์ชัน Forgot/Reset Password

อิง SRS: ฟังก์ชัน forgot password ที่ระบุใน Non-Functional (จะย้ายมาอยู่ Functional ในภายหลัง)

- [x] สร้างตาราง/โครงสร้างสำหรับเก็บ token รีเซ็ตรหัสผ่าน (ถ้าจำเป็น)
- [x] สร้าง API/route ขอรีเซ็ตรหัสผ่าน (POST /api/forgot-password)
  - [x] รับ email (หรือ username ถ้ามี)
  - [x] สร้าง token แบบสุ่ม คาดเดายาก และกำหนดวันหมดอายุ
  - [x] เก็บ token ผูกกับ user ใน DB
  - [x] ส่งอีเมลที่มีลิงก์รีเซ็ตรหัสผ่านให้ผู้ใช้ (mock หรือ integrate จริงตาม environment)
  - [x] ไม่บอกชัดเจนว่า email ไม่มีอยู่ในระบบ (เพื่อกันเดา)
- [x] สร้างหน้า UI สำหรับตั้งรหัสผ่านใหม่จาก token
  - [x] รับ token + password ใหม่ 2 ครั้ง
  - [x] ตรวจสอบ token ยังไม่หมดอายุ และสัมพันธ์กับ user
  - [x] ตรวจสอบความแข็งแรงรหัสผ่านใหม่
  - [x] hash password ใหม่และอัปเดต DB
  - [x] ยกเลิก token และ session เดิมทั้งหมด

---

## Phase 4 – ฟังก์ชัน BMI (บันทึก/แสดงผล/ประวัติ)

อิง SRS: หมวด 3.2

### 4.1 การบันทึกข้อมูล BMI

- [x] สร้างฟอร์มหน้า BMI Entry
  - [x] กรอกน้ำหนัก
  - [x] กรอกส่วนสูง (เมตร หรือเซนติเมตร)
  - [x] หมายเหตุ (optional)
- [x] สร้าง API/route สำหรับบันทึก BMI (POST /api/bmi-records)
  - [x] แปลงส่วนสูงเป็นเมตร (ถ้ากรอกเป็นเซนติเมตร)
  - [x] คำนวณ BMI = weight (kg) / height² (m²)
  - [x] คำนวณหมวดหมู่ภาวะน้ำหนัก (ผอม/ปกติ/เกิน/อ้วน ฯลฯ)
  - [x] บันทึกลงตาราง BMI_Records

### 4.2 แสดงประวัติ BMI

- [x] สร้าง API/route ดึงรายการ BMI ของ user (GET /api/bmi-records)
  - [x] รองรับ query parameter เช่น ช่วงวันที่, การจัดเรียง
- [x] สร้างหน้า BMI History
  - [x] แสดงตารางรายการ BMI (วันที่, น้ำหนัก, ส่วนสูง, BMI, หมวดหมู่, หมายเหตุ)
  - [x] ฟิลเตอร์ตามช่วงวันที่
  - [x] ฟิลเตอร์ตามช่วงค่า BMI (18.5–24.9 ฯลฯ)
  - [x] ค้นหาจากหมายเหตุ

### 4.3 Dashboard

- [x] สร้าง API/route สำหรับสรุปข้อมูลล่าสุด (GET /api/dashboard)
  - [x] ค่า BMI ล่าสุดของ user
  - [x] ค่า BMI เฉลี่ยช่วงล่าสุดตามที่ออกแบบ
  - [x] ข้อมูลสำหรับกราฟ trend
- [x] สร้างหน้า Dashboard
  - [x] แสดงค่า BMI ล่าสุด
  - [x] แสดงกราฟแนวโน้ม BMI ในช่วงที่กำหนด
  - [x] แสดงจำนวนครั้งในแต่ละหมวดหมู่ภาวะน้ำหนัก (ถ้าทำตาม SRS)

---

## Phase 5 – MIS Reports (Daily / Weekly / Monthly / Yearly)

อิง SRS: หมวด 3.3 ระบบรายงาน MIS

### 5.1 โครงสร้าง API รายงาน

- [x] ออกแบบ endpoint รายงาน เช่น:
  - [x] GET /api/reports/daily
  - [x] GET /api/reports/weekly
  - [x] GET /api/reports/monthly
  - [x] GET /api/reports/yearly
- [x] กำหนดรูปแบบ input:
  - [x] daily: วันที่
  - [x] weekly: วันที่อ้างอิง + กำหนดนิยามสัปดาห์ (Mon–Sun หรือ Sun–Sat)
  - [x] monthly: ปี + เดือน
  - [x] yearly: ปี
- [x] กำหนดรูปแบบ output ให้สอดคล้องกัน (เช่น JSON มี summary, list, stats)

### 5.2 สร้าง logic ของรายงาน

แต่ละช่วงเวลา ต้องคำนวณอย่างน้อย:

- [x] จำนวนรายการ BMI ในช่วงเวลานั้น
- [x] ค่า BMI เฉลี่ย, ต่ำสุด, สูงสุด
- [x] การแจกแจงตามหมวดหมู่ภาวะน้ำหนัก
- [x] ข้อมูลสำหรับกราฟ trend ตามช่วง (วัน/สัปดาห์/เดือน)

### 5.3 หน้า UI รายงาน

- [x] สร้างหน้ารวม MIS Reports พร้อมแท็บหรือเมนูเลือกช่วงเวลา
- [x] Daily Report UI
  - [x] เลือกวันที่
  - [x] แสดง summary + ตารางสรุป + กราฟ (ถ้าต้องการ)
- [x] Weekly Report UI
  - [x] เลือกสัปดาห์ (อาจใช้การเลือกวันที่แล้วคำนวณช่วง)
  - [x] แสดงข้อมูลตาม SRS
- [x] Monthly Report UI
  - [x] เลือกปี + เดือน
  - [x] แสดง summary และกราฟ
- [x] Yearly Report UI
  - [x] เลือกปี
  - [x] แสดงกราฟเปรียบเทียบ 12 เดือน + สรุปหมวดหมู่ภาวะน้ำหนักทั้งปี

---

## Phase 6 – ความปลอดภัย / Privacy / Logging / Scalability

อิง SRS: หมวด 4

### 6.1 Security

- [x] ตรวจสอบว่า route/API ที่ต้องล็อกอินป้องกันด้วย middleware auth ครบทุกจุด
- [x] ยืนยันการใช้งาน hashing password + salt
- [x] เพิ่มมาตรการป้องกัน:
  - [x] SQL Injection (ใช้ parameterized queries)
  - [x] XSS (escape output, ใช้การป้องกันใน framework)
  - [x] CSRF (ใช้ built-in protection หรือ token)
- [x] บังคับใช้ password policy ตามที่กำหนด

### 6.2 Privacy / PDPA

- [x] ตรวจสอบการแสดงผลข้อมูลว่ามีเฉพาะของ user เอง
- [x] หากมีรายงานระดับ Admin:
  - [x] ใช้ข้อมูลเชิงสถิติ ไม่ระบุผู้ใช้รายคน
- [x] เพิ่มฟังก์ชันลบข้อมูล BMI ของ user (ถ้าทำตาม SRS)

### 6.3 Logging & Audit

- [x] สร้างโมดูล logging กลาง
  - [x] บันทึก login success/fail
  - [x] บันทึกการเปลี่ยนรหัสผ่าน
  - [x] บันทึกการสร้าง/แก้ไข/ลบ BMI records
- [x] ตรวจสอบว่า log ไม่มีข้อมูลสำคัญ (password, token)

### 6.4 Scalability Constraints

- [x] กำหนดค่าขีดจำกัดที่ใช้ในการทดสอบ (จำนวน user / ข้อมูล)
- [x] ทดสอบ performance:
  - [x] Dashboard load
  - [x] การสร้าง MIS report ในช่วงเวลาปกติ

---

## Phase 7 – UI/UX & การใช้งาน

อิง SRS: 4.4 Usability, 6.1 UI

- [x] ทำให้ UI เป็น Responsive สำหรับ Desktop / Mobile
- [x] ใช้ภาษาไทยในข้อความ UI ตาม SRS
- [x] ปรับ Layout ของหน้า:
  - [x] Landing / Login / Register
  - [x] Dashboard
  - [x] BMI History, BMI Entry
  - [x] MIS Reports
- [x] ตรวจสอบ flow การใช้งาน:
  - [x] การสมัคร → login → dashboard → บันทึก BMI → ดูประวัติ → ดูรายงาน

---

## Phase 8 – Testing & Acceptance Criteria

อิง SRS: หมวด 8 เกณฑ์การยอมรับ

- [x] เขียน test (อย่างน้อย manual test case หรือ automated test บางส่วน) ให้ครอบคลุม:
  - [x] Registration / Login / Logout
  - [x] Forgot password (กรณีปกติ / token หมดอายุ / token ผิด)
  - [x] สร้าง/อ่าน/แก้ไข/ลบ BMI records
  - [x] Dashboard แสดงข้อมูลล่าสุดถูกต้อง
  - [x] MIS reports ให้ผลลัพธ์ถูกต้องสุ่มตรวจจากข้อมูลใน DB
- [x] ทดสอบว่า:
  - [x] ผู้ใช้แต่ละคนเห็นเฉพาะข้อมูลของตนเอง
  - [x] ระบบทำงานได้บนเบราว์เซอร์หลัก (Chrome, Edge, Safari)
  - [x] เวลาในการตอบสนองอยู่ในเกณฑ์ Performance ที่กำหนด
- [x] สรุปผลการทดสอบว่าเข้าเงื่อนไข Acceptance Criteria ทุกข้อใน SRS

---