# opencv.py
import cv2
import numpy as np
import base64
from supabase import create_client
from dotenv import load_dotenv
import os
import face_recognition

load_dotenv()

SUPABASE_URL = os.getenv("DB_URL")
SERVICE_ROLE_KEY = os.getenv("SERVICE_ROLE_KEY")

supabase = create_client(SUPABASE_URL, SERVICE_ROLE_KEY)


def load_known_faces():
    known_face_encodings = []
    known_face_names = []

    response = supabase.table("users").select("name, face_encoding").execute()

    if response.data:
        for row in response.data:
            name = row["name"]
            encoding_b64 = row["face_encoding"]

            if not encoding_b64:
                print(f"⚠️ Skipping {name}, no face encoding in DB")
                continue

            try:
                encoding_bytes = base64.b64decode(encoding_b64)
                encoding_array = np.frombuffer(encoding_bytes, dtype=np.float64)

                if encoding_array.shape[0] == 128:
                    known_face_encodings.append(encoding_array)
                    known_face_names.append(name)
            except Exception as e:
                print(f"⚠️ Error decoding face for {name}: {e}")

    return known_face_encodings, known_face_names


if __name__ == "__main__":
    known_face_encodings, known_face_names = load_known_faces()
    print(f"✅ Loaded {len(known_face_encodings)} faces from Supabase")

    camera = cv2.VideoCapture(0)

    while True:
        ret, frame = camera.read()
        if not ret:
            break

        
        small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
        rgb_small_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)

        
        face_locations = face_recognition.face_locations(rgb_small_frame)
        face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)

        for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
            name = "Unknown"

            
            matches = face_recognition.compare_faces(known_face_encodings, face_encoding, tolerance=0.6)
            face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)

            if len(face_distances) > 0:
                best_match_index = np.argmin(face_distances)
                if matches[best_match_index]:
                    name = known_face_names[best_match_index]

            
            top *= 4
            right *= 4
            bottom *= 4
            left *= 4

            
            cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)

            
            cv2.rectangle(frame, (left, bottom - 35), (right, bottom), (0, 255, 0), cv2.FILLED)

            
            font = cv2.FONT_HERSHEY_DUPLEX
            cv2.putText(frame, name, (left + 6, bottom - 6), font, 1.0, (255, 255, 255), 1)

        cv2.imshow("Camera", frame)

        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    camera.release()
    cv2.destroyAllWindows()
