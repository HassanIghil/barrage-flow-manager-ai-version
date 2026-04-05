# backend/app/models/repartition.py

from sqlalchemy import Column, Integer, Numeric, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.core.database import Base


class Repartition(Base):
    __tablename__ = "Repartition"

    id_repartition = Column(Integer, primary_key=True, index=True, autoincrement=True)
    id_lacher = Column(
        Integer,
        ForeignKey("Lacher_Eau.id_lacher", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    id_coop = Column(
        Integer,
        ForeignKey("Cooperative.id_coop", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    volume_attribue = Column(Numeric(15, 2), nullable=False)

    __table_args__ = (
        UniqueConstraint("id_lacher", "id_coop", name="unique_lacher_coop"),
    )

    lacher_eau = relationship("LacherEau", back_populates="repartitions")
    cooperative = relationship("Cooperative", back_populates="repartitions")
